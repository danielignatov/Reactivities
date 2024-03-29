#region Usings
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Persistence;
using Microsoft.EntityFrameworkCore;
using MediatR;
using Application.Activities;
using FluentValidation.AspNetCore;
using API.Middleware;
using Domain;
using Microsoft.AspNetCore.Identity;
using Application.Interfaces;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Infrastructure.Images;
using API.SignalR;
using Application.Profiles;
using Microsoft.AspNetCore.HttpOverrides;
using System.IO;
using Infrastructure.Notifications;
using NSwag;
using NSwag.Generation.Processors.Security;
#endregion

namespace API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureDevelopmentServices(IServiceCollection services)
        {
            var envName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            var path = Path.Combine(Directory.GetCurrentDirectory());
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(Path.Combine(Directory.GetCurrentDirectory()))
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{envName}.json", optional: false, reloadOnChange: true)
                .Build();

            ConfigureServices(services);
        }

        public void ConfigureProductionServices(IServiceCollection services)
        {
            var envName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(Path.Combine(Directory.GetCurrentDirectory()))
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{envName}.json", optional: false, reloadOnChange: true)
                .Build();

            ConfigureServices(services);
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // services.AddDbContext<DataContext>(opt =>
            //     opt.UseSqlite(Configuration.GetConnectionString("Default")
            // ));

            // Database configuration
            services.AddDbContext<DataContext>(opt =>
                opt.UseMySql(Configuration.GetConnectionString("Default")
            ));

            services.AddControllers(opt =>
            {
                var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
                opt.Filters.Add(new AuthorizeFilter(policy));
            }).AddFluentValidation(cfg =>
            {
                cfg.RegisterValidatorsFromAssemblyContaining<Create>();
            });

            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .WithExposedHeaders("WWW-Authenticate")
                    .WithOrigins("http://localhost:3000")
                    .AllowCredentials();
                });
            });
            services.AddMediatR(typeof(List.Handler).Assembly);
            services.AddAutoMapper(typeof(List.Handler));
            services.AddSignalR();

            // Register the Swagger services
            services.AddSwaggerDocument(document =>
            {
                document.SchemaType = NJsonSchema.SchemaType.OpenApi3;
                document.Title = "Reactivities API";
                document.DocumentProcessors.Add(
                    new SecurityDefinitionAppender(
                        "JWT Token",
                        new OpenApiSecurityScheme {
                            Type = OpenApiSecuritySchemeType.ApiKey,
                            Name = "Authorization",
                            Description = "Copy 'Bearer ' + valid JWT token into field",
                            In = OpenApiSecurityApiKeyLocation.Header
                        }));
            });

            var builder = services.AddIdentityCore<AppUser>(opt =>
            {
                opt.Password.RequireDigit = false;
                opt.Password.RequiredLength = 5;
                opt.Password.RequiredUniqueChars = 0;
                opt.Password.RequireLowercase = false;
                opt.Password.RequireNonAlphanumeric = false;
                opt.Password.RequireUppercase = false;
            });

            var identityBuilder = new IdentityBuilder(builder.UserType, builder.Services);
            identityBuilder.AddEntityFrameworkStores<DataContext>();
            identityBuilder.AddSignInManager<SignInManager<AppUser>>();

            services.AddAuthorization(opt =>
            {
                opt.AddPolicy("IsActivityHost", policy =>
                {
                    policy.Requirements.Add(new IsHostRequirement());
                });
                opt.AddPolicy("IsCurrentUser", policy =>
                {
                    policy.Requirements.Add(new IsImageUploaderRequirement());
                });
            });
            services.AddTransient<IAuthorizationHandler, IsHostRequirementHandler>();
            services.AddTransient<IAuthorizationHandler, IsImageUploaderRequirementHandler>();

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["TokenKey"]));
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(opt =>
                {
                    opt.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = key,
                        ValidateAudience = false,
                        ValidateIssuer = false,
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.Zero
                    };
                    opt.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"];
                            var path = context.HttpContext.Request.Path;

                            if (!string.IsNullOrEmpty(accessToken) && (path.StartsWithSegments("/chat")))
                            {
                                context.Token = accessToken;
                            }
                            return Task.CompletedTask;
                        }
                    };
                });

            services.AddScoped<IJwtGenerator, JwtGenerator>();
            services.AddScoped<IUserAccessor, UserAccessor>();
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<IAuthTokenService, AuthTokenService>();
            services.AddScoped<IImageAccessor, ImageAccessor>();
            services.AddScoped<IProfileReader, ProfileReader>();

            // Settings
            services.AddOptions();
            services.Configure<EmailServiceSettings>(Configuration.GetSection("SendInBlue"));
            services.Configure<CloudinarySettings>(Configuration.GetSection("Cloudinary"));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            });

            app.UseMiddleware<ErrorHandlingMiddleware>();

            // Register the Swagger generator and the Swagger UI middlewares
            app.UseOpenApi();
            app.UseSwaggerUi3();

            if (env.IsDevelopment())
            {
                //app.UseDeveloperExceptionPage();
            }

            // Security headers
            app.UseXContentTypeOptions();
            app.UseReferrerPolicy(opt => opt.NoReferrer());
            app.UseXXssProtection(opt => opt.EnabledWithBlockMode());
            app.UseXfo(opt => opt.Deny());
            app.UseCsp(opt => opt
                .BlockAllMixedContent()
                .StyleSources(s => s
                .Self()
                .CustomSources("https://fonts.googleapis.com", "sha256-cmP2eCxrfPHxkIn1t10NIVvG4k8Otfv+pko+wKm3D3k="))
                .FontSources(s => s
                .Self()
                .CustomSources("https://fonts.gstatic.com", "data:"))
                .FormActions(s => s.Self())
                .FrameAncestors(s => s.Self())
                .ImageSources(s => s
                .Self()
                .CustomSources("https://res.cloudinary.com", "blob:", "data:"))
                .ScriptSources(s => s
                .Self()
                .CustomSources("sha256-GQiIKyZxKjSwNCFWuNn8heHE2X2DfS9548rycfsyXvA=", "sha256-mxUxQYbb+kgrto8a3C1yUt2Rv+HsXa3JIj2Q6oL/cOs="))
            );

            //app.UseHttpsRedirection();

            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseCors("CorsPolicy");

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<ChatHub>("/chat");
                endpoints.MapFallbackToController("Index", "Fallback");
            });
        }
    }
}
