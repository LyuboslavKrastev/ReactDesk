﻿// <auto-generated />
using System;
using BasicDesk.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace BasicDesk.Data.Migrations
{
    [DbContext(typeof(BasicDeskDbContext))]
    partial class BasicDeskDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.1.1-rtm-30846")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("BasicDesk.Data.Models.Requests.ApprovalStatus", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50);

                    b.HasKey("Id");

                    b.ToTable("ApprovalStatuses");

                    b.HasData(
                        new { Id = 1, Name = "Pending" },
                        new { Id = 2, Name = "Approved" },
                        new { Id = 3, Name = "Denied" }
                    );
                });

            modelBuilder.Entity("BasicDesk.Data.Models.Requests.ReplyAttachment", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("FileName")
                        .IsRequired()
                        .HasMaxLength(200);

                    b.Property<string>("PathToFile")
                        .IsRequired()
                        .HasMaxLength(1000);

                    b.Property<int>("ReplyId");

                    b.HasKey("Id");

                    b.HasIndex("ReplyId");

                    b.ToTable("ReplyAttachments");
                });

            modelBuilder.Entity("BasicDesk.Data.Models.Requests.Request", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("AssignedToId");

                    b.Property<int?>("AssignedToId1");

                    b.Property<int>("CategoryId");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(20000);

                    b.Property<DateTime?>("EndTime");

                    b.Property<int>("RequesterId");

                    b.Property<string>("Resolution");

                    b.Property<DateTime>("StartTime");

                    b.Property<int>("StatusId");

                    b.Property<string>("Subject")
                        .IsRequired()
                        .HasMaxLength(200);

                    b.HasKey("Id");

                    b.HasIndex("AssignedToId1");

                    b.HasIndex("CategoryId");

                    b.HasIndex("RequesterId");

                    b.HasIndex("StatusId");

                    b.ToTable("Requests");
                });

            modelBuilder.Entity("BasicDesk.Data.Models.Requests.RequestApproval", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ApproverComment");

                    b.Property<string>("ApproverId");

                    b.Property<int?>("ApproverId1");

                    b.Property<string>("Description");

                    b.Property<int>("RequestId");

                    b.Property<string>("RequesterId");

                    b.Property<int?>("RequesterId1");

                    b.Property<int>("StatusId");

                    b.Property<string>("Subject")
                        .HasMaxLength(200);

                    b.HasKey("Id");

                    b.HasIndex("ApproverId1");

                    b.HasIndex("RequestId");

                    b.HasIndex("RequesterId1");

                    b.HasIndex("StatusId");

                    b.ToTable("RequestApprovals");
                });

            modelBuilder.Entity("BasicDesk.Data.Models.Requests.RequestAttachment", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("FileName")
                        .IsRequired()
                        .HasMaxLength(200);

                    b.Property<string>("PathToFile")
                        .IsRequired()
                        .HasMaxLength(1000);

                    b.Property<int>("RequestId");

                    b.HasKey("Id");

                    b.HasIndex("RequestId");

                    b.ToTable("RequestAttachments");
                });

            modelBuilder.Entity("BasicDesk.Data.Models.Requests.RequestCategory", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50);

                    b.HasKey("Id");

                    b.ToTable("RequestCategories");
                });

            modelBuilder.Entity("BasicDesk.Data.Models.Requests.RequestNote", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Author")
                        .IsRequired();

                    b.Property<DateTime>("CreationTime");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(20000);

                    b.Property<int>("RequestId");

                    b.HasKey("Id");

                    b.HasIndex("RequestId");

                    b.ToTable("RequestNotes");
                });

            modelBuilder.Entity("BasicDesk.Data.Models.Requests.RequestReply", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("AuthorId");

                    b.Property<int?>("AuthorId1");

                    b.Property<DateTime>("CreationTime");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(20000);

                    b.Property<int>("RequestId");

                    b.Property<string>("Subject")
                        .IsRequired()
                        .HasMaxLength(200);

                    b.HasKey("Id");

                    b.HasIndex("AuthorId1");

                    b.HasIndex("RequestId");

                    b.ToTable("RequestReplies");
                });

            modelBuilder.Entity("BasicDesk.Data.Models.Requests.RequestStatus", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50);

                    b.HasKey("Id");

                    b.ToTable("RequestStatuses");

                    b.HasData(
                        new { Id = 1, Name = "Open" },
                        new { Id = 2, Name = "Closed" },
                        new { Id = 3, Name = "Rejected" },
                        new { Id = 4, Name = "On Hold" },
                        new { Id = 5, Name = "For Approval" }
                    );
                });

            modelBuilder.Entity("BasicDesk.Data.Models.Role", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Name");

                    b.HasKey("Id");

                    b.ToTable("Roles");

                    b.HasData(
                        new { Id = 1, Name = "User" },
                        new { Id = 2, Name = "Helpdesk" },
                        new { Id = 3, Name = "Admin" }
                    );
                });

            modelBuilder.Entity("BasicDesk.Data.Models.Solution.Solution", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("AuthorId");

                    b.Property<int?>("AuthorId1");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasMaxLength(20000);

                    b.Property<DateTime>("CreationTime");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(200);

                    b.Property<int>("Views");

                    b.HasKey("Id");

                    b.HasIndex("AuthorId1");

                    b.ToTable("Solutions");
                });

            modelBuilder.Entity("BasicDesk.Data.Models.Solution.SolutionAttachment", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("FileName")
                        .IsRequired()
                        .HasMaxLength(200);

                    b.Property<string>("PathToFile")
                        .IsRequired()
                        .HasMaxLength(1000);

                    b.Property<int>("SolutionId");

                    b.HasKey("Id");

                    b.HasIndex("SolutionId");

                    b.ToTable("SolutionAttachments");
                });

            modelBuilder.Entity("BasicDesk.Data.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasMaxLength(50);

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasMaxLength(50);

                    b.Property<byte[]>("PasswordHash")
                        .IsRequired();

                    b.Property<byte[]>("PasswordSalt")
                        .IsRequired();

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasMaxLength(50);

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("BasicDesk.Data.Models.UserRole", b =>
                {
                    b.Property<int>("RoleId");

                    b.Property<int>("UserId");

                    b.HasKey("RoleId", "UserId");

                    b.HasIndex("UserId");

                    b.ToTable("UserRoles");
                });

            modelBuilder.Entity("BasicDesk.Data.Models.Requests.ReplyAttachment", b =>
                {
                    b.HasOne("BasicDesk.Data.Models.Requests.RequestReply", "Reply")
                        .WithMany("Attachments")
                        .HasForeignKey("ReplyId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("BasicDesk.Data.Models.Requests.Request", b =>
                {
                    b.HasOne("BasicDesk.Data.Models.User", "AssignedTo")
                        .WithMany()
                        .HasForeignKey("AssignedToId1");

                    b.HasOne("BasicDesk.Data.Models.Requests.RequestCategory", "Category")
                        .WithMany()
                        .HasForeignKey("CategoryId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("BasicDesk.Data.Models.User", "Requester")
                        .WithMany("Requests")
                        .HasForeignKey("RequesterId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("BasicDesk.Data.Models.Requests.RequestStatus", "Status")
                        .WithMany()
                        .HasForeignKey("StatusId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("BasicDesk.Data.Models.Requests.RequestApproval", b =>
                {
                    b.HasOne("BasicDesk.Data.Models.User", "Approver")
                        .WithMany()
                        .HasForeignKey("ApproverId1");

                    b.HasOne("BasicDesk.Data.Models.Requests.Request", "Request")
                        .WithMany("Approvals")
                        .HasForeignKey("RequestId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("BasicDesk.Data.Models.User", "Requester")
                        .WithMany()
                        .HasForeignKey("RequesterId1");

                    b.HasOne("BasicDesk.Data.Models.Requests.ApprovalStatus", "Status")
                        .WithMany()
                        .HasForeignKey("StatusId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("BasicDesk.Data.Models.Requests.RequestAttachment", b =>
                {
                    b.HasOne("BasicDesk.Data.Models.Requests.Request", "Request")
                        .WithMany("Attachments")
                        .HasForeignKey("RequestId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("BasicDesk.Data.Models.Requests.RequestNote", b =>
                {
                    b.HasOne("BasicDesk.Data.Models.Requests.Request", "Request")
                        .WithMany("Notes")
                        .HasForeignKey("RequestId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("BasicDesk.Data.Models.Requests.RequestReply", b =>
                {
                    b.HasOne("BasicDesk.Data.Models.User", "Author")
                        .WithMany()
                        .HasForeignKey("AuthorId1");

                    b.HasOne("BasicDesk.Data.Models.Requests.Request", "Request")
                        .WithMany("Repiles")
                        .HasForeignKey("RequestId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("BasicDesk.Data.Models.Solution.Solution", b =>
                {
                    b.HasOne("BasicDesk.Data.Models.User", "Author")
                        .WithMany()
                        .HasForeignKey("AuthorId1");
                });

            modelBuilder.Entity("BasicDesk.Data.Models.Solution.SolutionAttachment", b =>
                {
                    b.HasOne("BasicDesk.Data.Models.Solution.Solution", "Solution")
                        .WithMany("Attachments")
                        .HasForeignKey("SolutionId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("BasicDesk.Data.Models.UserRole", b =>
                {
                    b.HasOne("BasicDesk.Data.Models.Role")
                        .WithMany("Users")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("BasicDesk.Data.Models.User")
                        .WithMany("Roles")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
