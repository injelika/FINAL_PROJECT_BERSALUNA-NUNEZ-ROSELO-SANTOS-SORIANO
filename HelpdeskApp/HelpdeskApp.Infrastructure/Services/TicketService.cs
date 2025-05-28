public class TicketService : ITicketService
{
    private readonly AppDbContext _context;

    public TicketService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Ticket>> GetAllAsync() => await _context.Tickets.Include(t => t.CreatedBy).ToListAsync();

    public async Task<Ticket?> GetByIdAsync(int id) => await _context.Tickets.Include(t => t.Remarks).FirstOrDefaultAsync(t => t.Id == id);

    public async Task<Ticket> CreateAsync(TicketCreateDto dto, int userId)
    {
        var ticket = new Ticket
        {
            Title = dto.Title,
            Description = dto.Description,
            Severity = dto.Severity,
            Status = TicketStatus.Open,
            CreatedByUserId = userId,
            DepartmentId = dto.DepartmentId
        };

        _context.Tickets.Add(ticket);
        await _context.SaveChangesAsync();
        return ticket;
    }

    public async Task UpdateAsync(int id, TicketUpdateDto dto)
    {
        var ticket = await _context.Tickets.FindAsync(id);
        if (ticket == null) throw new Exception("Ticket not found");

        ticket.Status = dto.Status;
        ticket.AssignedToUserId = dto.AssignedToUserId;
        await _context.SaveChangesAsync();
    }

    public async Task AddRemarkAsync(RemarkDto dto)
    {
        var remark = new Remark { Content = dto.Content, TicketId = dto.TicketId, AuthorId = dto.AuthorId };
        _context.Remarks.Add(remark);
        await _context.SaveChangesAsync();
    }
}
