﻿using BasicDesk.Data.Models.Solution;
using BasicDesk.Data.Models.Requests;
using BasicDesk.Data.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using BasicDesk.Common.Constants;

namespace BasicDesk.Data
{
    public class BasicDeskDbContext : DbContext
    {
        public BasicDeskDbContext(DbContextOptions<BasicDeskDbContext> options)
            : base(options){}

        public DbSet<User> Users { get; set; }

        public DbSet<Role> Roles { get; set; }

        public DbSet<Request> Requests { get; set; }

        public DbSet<RequestReply> RequestReplies { get; set; }
        public DbSet<ReplyAttachment> ReplyAttachments { get; set; }

        public DbSet<RequestStatus> RequestStatuses { get; set; }

        public DbSet<RequestCategory> RequestCategories { get; set; }

        public DbSet<RequestAttachment> RequestAttachments { get; set; }

        public DbSet<RequestApproval> RequestApprovals { get; set; }

        public DbSet<ApprovalStatus> ApprovalStatuses { get; set; }

        public DbSet<RequestNote> RequestNotes { get; set; }

        public DbSet<Solution> Solutions { get; set; }

        public DbSet<SolutionAttachment> SolutionAttachments { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Request>()
                .HasOne(u => u.Requester)
                .WithMany(r => r.Requests)
                .HasForeignKey(u => u.RequesterId);

            builder.Entity<Request>()
                .HasMany(r => r.Attachments)
                .WithOne(a => a.Request)
                .HasForeignKey(a => a.RequestId);

            builder.Entity<Solution>()
                .HasMany(s => s.Attachments)
                .WithOne(a => a.Solution)
                .HasForeignKey(a => a.SolutionId);

            //seed approval statuses
            builder.Entity<ApprovalStatus>().HasData(
                new ApprovalStatus { Id = WebConstants.PendingApprovalStatusId, Name = WebConstants.PendingApprovalStatusName},
                new ApprovalStatus { Id = WebConstants.ApprovedApprovalStatusId, Name = WebConstants.ApprovedApprovalStatusName},
                new ApprovalStatus { Id = WebConstants.DeniedApprovalStatusId, Name = WebConstants.DeniedApprovalStatusName }
            );

            builder.Entity<Role>().HasData(
              new Role { Id = WebConstants.UserRoleId, Name = WebConstants.UserRoleName },
              new Role { Id = WebConstants.HelpdeskRoleId, Name = WebConstants.HelpdeskRoleName },
              new Role { Id = WebConstants.AdminRoleId, Name = WebConstants.AdminRoleName }
            );

            builder.Entity<RequestStatus>().HasData(
                new RequestStatus { Id = WebConstants.OpenStatusId, Name = "Open"},
                new RequestStatus { Id = WebConstants.ClosedStatusId, Name = "Closed" },
                new RequestStatus { Id = WebConstants.RejectedStatusId, Name = "Rejected" },
                new RequestStatus { Id = WebConstants.OnHoldStatusId, Name = "On Hold" },
                new RequestStatus { Id = WebConstants.ForApprovalStatusId, Name = "For Approval" }
           );

            builder.Entity<RequestCategory>().HasData(
               new RequestCategory { Id = WebConstants.FirstCategoryId, Name = "First Category" },
               new RequestCategory { Id = WebConstants.SecondCategoryId, Name = "Second Category" },
               new RequestCategory { Id = WebConstants.ThirdCategoryId, Name = "Third Category" },
               new RequestCategory { Id = WebConstants.FourthCategoryId, Name = "Fourth Category" },
               new RequestCategory { Id = WebConstants.FifthCategoryId, Name = "Fifth Category" }
          );

            base.OnModelCreating(builder);
        }
    }
}
