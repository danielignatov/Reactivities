using FluentValidation;

namespace Application.Validators
{
    public static class ValidatorExtentions
    {
        public static IRuleBuilder<T, string> Password<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            var options = ruleBuilder
                .NotEmpty()
                .MinimumLength(5).WithMessage("Password must contain 5 characters");
                //.Matches("[A-Z]").WithMessage("Password must contain 1 uppercase letter")
                //.Matches("[a-z]").WithMessage("Password must contain 1 lowercase character")
                //.Matches("[0-9]").WithMessage("Password must contain 1 digit");

            return options;
        }
    }
}