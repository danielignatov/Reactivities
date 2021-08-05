using System.Linq;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ProfileReader : IProfileReader
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;

        public ProfileReader(DataContext context, IUserAccessor userAccessor)
        {
            _context = context;
            _userAccessor = userAccessor;
        }

        public async Task<Profile> ReadProfile(string username)
        {
            var user = await 
                _context
                .Users
                .Include(x => x.Images)
                .Include(x => x.Followers)
                .Include(x => x.Following)
                .SingleOrDefaultAsync(x => x.UserName == username);

            if (user == null)
                throw new RestException(System.Net.HttpStatusCode.NotFound, new { User = "Not found" });

            var currentUser = await _userAccessor.GetCurrentUserAsync();

            bool isFollowed =
                (currentUser != null) ?
                user.Followers.Any(x => x.ObserverId == currentUser.Id) :
                false;

            var profile = new Profile()
            {
                DisplayName = user.DisplayName,
                Username = user.UserName,
                Image = user.Images.FirstOrDefault(x => x.IsMain)?.Url,
                Images = user.Images,
                Bio = user.Bio,
                FollowersCount = user.Followers.Count(),
                FollowingCount = user.Following.Count(),
                IsFollowed = isFollowed
            };

            return profile;
        }
    }
}