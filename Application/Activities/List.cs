using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class ActivitiesEnvelope
        {
            public List<ActivityDto> Activities { get; set; }

            public int ActivityCount { get; set; }
        }

        public class Query : IRequest<ActivitiesEnvelope>
        {
            public Query(
                int limit = 25,
                int offset = 0,
                bool isGoing = false,
                bool isHost = false,
                DateTime? startDate = null)
            {
                Limit = limit;
                Offset = offset;
                IsGoing = isGoing;
                IsHost = isHost;
                StartDate = startDate ?? DateTime.Now;
            }

            public int Limit { get; set; }

            public int Offset { get; set; }

            public bool IsGoing { get; set; }

            public bool IsHost { get; set; }

            public DateTime StartDate { get; set; }
        }

        public class Handler : IRequestHandler<Query, ActivitiesEnvelope>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(
                DataContext context,
                IUserAccessor userAccessor, 
                IMapper mapper)
            {
                _mapper = mapper;
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<ActivitiesEnvelope> Handle(Query request, CancellationToken cancellationToken)
            {
                var queryable =
                _context.Activities
                .Include(x => x.Comments)
                .ThenInclude(x => x.Author)
                .ThenInclude(x => x.Images)
                .Include(x => x.UserActivities)
                .ThenInclude(x => x.AppUser)
                .ThenInclude(x => x.Images)
                .Where(x => x.Date >= request.StartDate)
                .OrderBy(x => x.Date)
                .AsQueryable();

                if (request.IsGoing && !request.IsHost)
                {
                    queryable = 
                    queryable
                    .Where(x => x.UserActivities
                    .Any(a => a.AppUser.UserName == _userAccessor.GetCurrentUsername()));
                }

                if (request.IsHost && !request.IsGoing)
                {
                    queryable = 
                    queryable
                    .Where(x => x.UserActivities
                    .Any(a => 
                    a.AppUser.UserName == _userAccessor.GetCurrentUsername() &&
                    a.IsHost == true));
                }

                var activities =
                await queryable
                .Skip(request.Offset)
                .Take(request.Limit)
                .ToListAsync(cancellationToken);

                return new ActivitiesEnvelope
                {
                    Activities = _mapper.Map<List<Activity>, List<ActivityDto>>(activities),
                    ActivityCount = queryable.Count()
                };
            }
        }
    }
}