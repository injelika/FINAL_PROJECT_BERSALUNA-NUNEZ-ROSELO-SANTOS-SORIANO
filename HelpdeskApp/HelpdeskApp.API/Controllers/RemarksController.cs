[ApiController]
[Route("api/[controller]")]
public class RemarksController : ControllerBase
{
    private readonly ITicketService _ticketService;

    public RemarksController(ITicketService ticketService)
    {
        _ticketService = ticketService;
    }

    [HttpPost]
    public async Task<IActionResult> AddRemark([FromBody] RemarkDto dto)
    {
        await _ticketService.AddRemarkAsync(dto);
        return Ok();
    }
}

