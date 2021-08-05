using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    /// <summary>Application user entity. Inherits IdentityUser.</summary>
    public class AppUser : IdentityUser
    {
        /// <summary>User display name. Can be changed.</summary>
        public string DisplayName { get; set; }

        /// <summary>User biography. Optional.</summary>
        public string Bio { get; set; }

        /// <summary>User locale preference. Optional.</summary>
        public string Locale { get; set; }

        /// <summary>Date of user registration. In UTC.</summary>
        public DateTime RegistrationDate { get; set; }

        /// <summary>Hold collection of user activities.</summary>
        public ICollection<UserActivity> UserActivities { get; set; }

        /// <summary>Hold collection of user uploaded photos.</summary>
        public ICollection<Image> Images { get; set; }

        /// <summary>Hold collection of users that follow this user.</summary>
        public ICollection<UserFollowing> Followers { get; set; }

        /// <summary>Hold collection of users that this user follows.</summary>
        public ICollection<UserFollowing> Following { get; set; }
    }
}