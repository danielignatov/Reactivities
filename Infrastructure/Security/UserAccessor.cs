using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security
{
    public class UserAccessor : IUserAccessor
    {
        private readonly DataContext _context;

        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserAccessor(DataContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        public string GetCurrentUsername()
        {
            var username = _httpContextAccessor
                .HttpContext
                .User?
                .Claims?
                .FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?
                .Value;

            return username;
        }

        public async Task<AppUser> GetCurrentUserAsync()
        {
            var username = this.GetCurrentUsername();

            if (string.IsNullOrEmpty(username))
                return null;

            var user =
            await _context.Users
            .Include(x => x.Images)
            .Include(x => x.Followers)
            .Include(x => x.Following)
            .SingleOrDefaultAsync(x => x.UserName == username);

            return user;
        }
    }
}