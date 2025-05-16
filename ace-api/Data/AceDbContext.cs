using ace_api.Models;
using Microsoft.EntityFrameworkCore;

namespace ace_api.Data;

public class AceDbContext : DbContext
{
    public AceDbContext(DbContextOptions<AceDbContext> options) : base(options)
    {
    }

    public DbSet<Address> Addresses { get; set; } = null!;
    public DbSet<Role> Roles { get; set; } = null!;
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Agent> Agents { get; set; } = null!;
    public DbSet<AgentVideo> AgentVideos { get; set; } = null!;
    public DbSet<Map> Maps { get; set; } = null!;
    public DbSet<Guide> Guides { get; set; } = null!;
    public DbSet<Comment> Comments { get; set; } = null!;
    public DbSet<Skin> Skins { get; set; } = null!;
    public DbSet<Weapon> Weapons { get; set; } = null!;
    public DbSet<WeaponCategory> WeaponCategories { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasOne(u => u.Role)
            .WithMany(r => r.Users)
            .HasForeignKey(u => u.RoleId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<User>()
            .HasOne(u => u.Address)
            .WithMany(a => a.Users)
            .HasForeignKey(u => u.AddressId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Guide>()
            .HasOne(g => g.User)
            .WithMany(u => u.Guides)
            .HasForeignKey(g => g.UserId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Comment>()
            .HasOne(c => c.Guide)
            .WithMany(g => g.Comments)
            .HasForeignKey(c => c.GuideId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Comment>()
            .HasOne(c => c.User)
            .WithMany(u => u.Comments)
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<AgentVideo>()
            .HasOne(av => av.Agent)
            .WithMany(a => a.AgentVideos)
            .HasForeignKey(av => av.AgentId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}