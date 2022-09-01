using Sabio.Models;
using Sabio.Models.Domain.Event;
using Sabio.Models.Requests.Events;

namespace Sabio.Services
{
    public interface IEventService
    {
        int Add(EventAddRequest model, int userId);
        void Delete(int id);
        Paged<Event> GetAllDetails(int pageIndex, int pageSize);
        Event GetById(int id);
        Paged<Event> GetCreatedByPaged(int pageIndex, int pageSize, int userId);
        Paged<Event> Search(int pageIndex, int pageSize, string query);
        void Update(EventUpdateRequest model, int userId);
    }
}