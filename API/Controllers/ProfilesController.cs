using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Profiles;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController : BaseController
    {
        [HttpGet("{username}")]
        [AllowAnonymous]
        public async Task<ActionResult<Profile>> Get(string username) 
        {
            return await Mediator.Send(new Details.Query{Username = username});
        }

        [HttpPut]
        public async Task<ActionResult<Unit>> Edit(Edit.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpGet("{username}/activities")]
        [AllowAnonymous]
        public async Task<ActionResult<List<UserActivityDto>>> GetUserActivities(
            string username, string predicate)
        {
            return await Mediator.Send(new ListActivities.Query{Username = username, Predicate = predicate});
        }
    }
}