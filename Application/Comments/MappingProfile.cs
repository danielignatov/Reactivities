using System.Linq;
using AutoMapper;
using Domain;

namespace Application.Comments
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Comment, CommentDto>()
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.Author.UserName))
                .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(src => src.Author.DisplayName))
                .ForMember(dest => dest.Image, opt => opt.MapFrom(src => src.Author.Images.FirstOrDefault(x => x.IsMain).Url));
        }
    }
}