public interface ITicketService
{
    Task<IEnumerable<Ticket>> GetAllAsync();
    Task<Ticket?> GetByIdAsync(int id);
    Task<Ticket> CreateAsync(TicketCreateDto dto, int userId);
    Task UpdateAsync(int id, TicketUpdateDto dto);
    Task AddRemarkAsync(RemarkDto dto);
}
