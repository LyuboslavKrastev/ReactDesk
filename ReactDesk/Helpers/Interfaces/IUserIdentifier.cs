using System.Security.Claims;
using BasicDesk.Data.Models;

namespace ReactDesk.Helpers.Interfaces
{
    public interface IUserIdentifier
    {
        User Identify(ClaimsPrincipal userClaimsPrincipal);
        bool IsTechnician(int roleId);
    }
}