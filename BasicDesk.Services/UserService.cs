using BasicDesk.Common.Constants;
using BasicDesk.Data;
using BasicDesk.Data.Models;
using BasicDesk.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BasicDesk.Services
{
    public class UserService : IUserService
    {
        private BasicDeskDbContext _context;
        private readonly IRoleService roleService;

        public UserService(BasicDeskDbContext context, IRoleService roleService)
        {
            _context = context;
            this.roleService = roleService;
        }

        public User Authenticate(string username, string password)
        {
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
                return null;

            var user = _context.Users.Include(u => u.Role).SingleOrDefault(u => u.Username == username);

            // check if username exists
            if (user == null)
                return null;

            // check if password is correct
            if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
                return null;

            // authentication successful
            return user;
        }

        public IEnumerable<User> GetAll()
        {
            return _context.Users.Include(u => u.Role);
        }

        public IEnumerable<User> GetAllTechnicians()
        {
            var users = _context.Users
                .Where(r => r.RoleId == WebConstants.HelpdeskRoleId || r.RoleId == WebConstants.AdminRoleId);

            return users;
        }

        public User GetById(string id)
        {
            return _context.Users.Include(u => u.Role).FirstOrDefault(u => u.Id == id);
        }

        public User Create(User user, string password)
        {
            // validation
            if (string.IsNullOrWhiteSpace(password))
            {
                throw new ArgumentException("Password is required");
            }

            if (_context.Users.Any(x => x.Username == user.Username))
            {
                throw new ArgumentException("Username \"" + user.Username + "\" is already taken");
            }

            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(password, out passwordHash, out passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            if (!_context.Users.Any())
            {
                // the first registered user shall be an admin
                user.RoleId = WebConstants.AdminRoleId;
            }
            else
            {
                // all others shall be users
                user.RoleId = WebConstants.UserRoleId;
            }

            _context.Users.Add(user);
            _context.SaveChanges();

            return user;
        }

        public void Update(User userParam, string password = null)
        {
            var user = _context.Users.Find(userParam.Id);

            if (user == null)
            {
                throw new ArgumentException("User not found");
            }
               

            if (userParam.Username != user.Username)
            {
                // username has changed so check if the new username is already taken
                if (_context.Users.Any(x => x.Username == userParam.Username))
                    throw new ArgumentException("Username " + userParam.Username + " is already taken");
            }

            // update user properties
            user.FullName = userParam.FullName;
            user.Username = userParam.Username;

            // update password if it was entered
            if (!string.IsNullOrWhiteSpace(password))
            {
                byte[] passwordHash, passwordSalt;
                CreatePasswordHash(password, out passwordHash, out passwordSalt);

                user.PasswordHash = passwordHash;
                user.PasswordSalt = passwordSalt;
            }

            _context.Users.Update(user);
            _context.SaveChanges();
        }

        public void Delete(string id)
        {
            var user = _context.Users.Find(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }
        }

        public void Ban(string id)
        {
            User user = _context.Users.FirstOrDefault(u => u.Id == id);
            user.IsBanned = true;
            _context.SaveChanges();
        }

        public void Unban(string id)
        {
            User user = _context.Users.FirstOrDefault(u => u.Id == id);
            user.IsBanned = false;
            _context.SaveChanges();
        }

        public void AddToRoleAsync(string userId, int roleId)
        {
            Role role = this.roleService.ById(roleId);
            User user = this.GetById(userId);

            if(user == null)
            {
                throw new ArgumentException("User not found");
            }
            if(role == null)
            {
                throw new ArgumentException("Role not found");
            }

            user.RoleId = role.Id;
            _context.SaveChanges();
        }

        // private helper methods

        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");

            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private static bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");
            if (storedHash.Length != 64) throw new ArgumentException("Invalid length of password hash (64 bytes expected).", "passwordHash");
            if (storedSalt.Length != 128) throw new ArgumentException("Invalid length of password salt (128 bytes expected).", "passwordHash");

            using (var hmac = new System.Security.Cryptography.HMACSHA512(storedSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != storedHash[i]) return false;
                }
            }

            return true;
        }
    }

}
