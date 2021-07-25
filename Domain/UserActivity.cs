using System;
using System.ComponentModel.DataAnnotations;

namespace Domain
{
    public class UserActivity
    {
        public string AppUserId { get; set; }

        public AppUser AppUser { get; set; }

        [MaxLength(255)]
        public Guid ActivityId { get; set; }

        public Activity Activity { get; set; }

        public DateTime DateJoined { get; set; }

        public bool IsHost { get; set; }
    }
}