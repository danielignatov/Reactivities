using System.Threading.Tasks;
using Domain;

namespace Application.Interfaces
{
    public interface IUserAccessor
    {
         string GetCurrentUsername();

         Task<AppUser> GetCurrentUserAsync();

         bool IsUserLogged();
    }
}