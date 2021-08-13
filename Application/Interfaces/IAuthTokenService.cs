using System;
using System.Threading.Tasks;
using Application.Enums;
using Domain;

namespace Application.Interfaces
{
    public interface IAuthTokenService
    {
        /// <summary>Create auth token by providing app user id and expiration date.</summary>
        /// <param name="appUserId">Id of app user</param>
        /// <param name="expireAfterHours">Hours after the token will no longer be considered valid</param>
        Task<string> CreateAuthTokenAsync(string appUserId, int expireAfterHours = 24);

        /// <summary>Validate auth token by providing token key.</summary>
        /// <param name="token">Auth token key</param>
        Task<AuthTokenValidationResult> ValidateAuthTokenAsync(string token);

        /// <summary>Get app user from existing auth token by providing token key.</summary>
        /// <param name="token">Auth token key</param>
        Task<AppUser> GetAppUserAsync(string token);

        /// <summary>Remove auth token by providing token key.</summary>
        /// <param name="token">Auth token key</param>
        Task RemoveAuthTokenAsync(string token);
    }
}