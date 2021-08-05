using System;
using System.Linq;
using Application.Interfaces;
using AutoMapper;
using Domain;
using Persistence;

namespace Application.Activities
{
    public class FollowingResolver : IValueResolver<UserActivity, AttendeeDto, bool>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;

        public FollowingResolver(DataContext context, IUserAccessor userAccessor)
        {
            _context = context;
            _userAccessor = userAccessor;
        }

        public bool Resolve(UserActivity source, AttendeeDto destination, bool destMember, ResolutionContext context)
        {
            var currentUser = _userAccessor.GetCurrentUserAsync().Result;

            if (currentUser != null && currentUser.Following.Any(x => x.TargetId == source.AppUserId))
            {
                return true;
            }

            return false;
        }
    }
}