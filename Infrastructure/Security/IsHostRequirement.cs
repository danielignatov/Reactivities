using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security
{
    public class IsHostRequirement : IAuthorizationRequirement
    {

    }

    public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly DataContext _context;

        public IsHostRequirementHandler(
            IHttpContextAccessor httpContextAccessor,
            DataContext context)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext authContext,
            IsHostRequirement requirement)
        {
            var httpContext = _httpContextAccessor.HttpContext;

            if (httpContext.Request.RouteValues.ContainsKey("id"))
            {
                var currentUserName =
                _httpContextAccessor.HttpContext.User?.Claims?
                .SingleOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

                var activityId =
                Guid.Parse(_httpContextAccessor.HttpContext.Request.RouteValues["id"].ToString());

                var activity = 
                _context.Activities.Include(x => x.UserActivities).ThenInclude(x => x.AppUser).FirstOrDefaultAsync(x => x.Id == activityId).Result;

                var host = 
                activity.UserActivities.FirstOrDefault(x => x.IsHost);

                if (host?.AppUser?.UserName == currentUserName)
                    authContext.Succeed(requirement);
            }
            else
            {
                authContext.Fail();
            }

            return Task.CompletedTask;
        }
    }
}