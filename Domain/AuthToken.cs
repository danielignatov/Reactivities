using System;
using System.ComponentModel.DataAnnotations;

namespace Domain
{
    public class AuthToken
    {
        [MaxLength(255)]
        public Guid Id { get; set; }

        public string Token { get; set; }

        public string AppUserId { get; set; }

        public AppUser AppUser { get; set; }

        public DateTime Expiration { get; set; }
    }
}