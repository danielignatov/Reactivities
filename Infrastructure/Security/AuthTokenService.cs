using System;
using System.Linq;
using System.Threading.Tasks;
using Application.Enums;
using Application.Interfaces;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security
{
    public class AuthTokenService : IAuthTokenService
    {
        private readonly DataContext _context;
        
        public AuthTokenService(DataContext context)
        {
            _context = context;
        }

        public async Task<string> CreateAuthTokenAsync(string appUserId, int expireAfterHours = 24)
        {
            var authToken = 
            new AuthToken()
            {
                AppUserId = appUserId,
                Expiration = DateTime.UtcNow.AddHours(expireAfterHours),
                Token = GetUniqueToken()
            };

            _context.AuthTokens.Add(authToken);
            await _context.SaveChangesAsync();

            return authToken.Token;
        }

        public async Task<AppUser> GetAppUserAsync(string token)
        {
            return await _context
            .AuthTokens
            .Include(x => x.AppUser)
            .Where(x => x.Token == token)
            .Select(x => x.AppUser)
            .FirstOrDefaultAsync();
        }

        public async Task RemoveAuthTokenAsync(string token)
        {
            var authToken = 
            _context
            .AuthTokens
            .Where(x => x.Token == token)
            .FirstOrDefault();

            if (authToken != null)
            {
                _context.Remove(authToken);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<AuthTokenValidationResult> ValidateAuthTokenAsync(string token)
        {
            var authToken = 
            await _context
            .AuthTokens
            .Where(x => x.Token == token)
            .FirstOrDefaultAsync();
            
            if (authToken == null)
                return AuthTokenValidationResult.NotFound;

            if (authToken.Expiration < DateTime.UtcNow)
                return AuthTokenValidationResult.Expired;

            return AuthTokenValidationResult.Valid;
        }

        private string GetUniqueToken()
        {
            var token = Guid.NewGuid().ToString("n");

            while (_context.AuthTokens.Any(x => x.Token == token))
            {
                token = Guid.NewGuid().ToString("n");
            }

            return token;
        }
    }
}