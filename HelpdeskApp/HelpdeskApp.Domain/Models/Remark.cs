public class Remark
{
    public int Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public int TicketId { get; set; }
    public Ticket Ticket { get; set; } = null!;
    public int AuthorId { get; set; }
    public User Author { get; set; } = null!;
}
