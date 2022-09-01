using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Event;
using Sabio.Models.Domain.Location;
using Sabio.Models.Requests.Events;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class EventService : IEventService
    {
        IDataProvider _data = null;

        public EventService(IDataProvider data)
        {
            _data = data;
        }

        public int Add(EventAddRequest model, int userId)
        {
            string procName = "[dbo].[Events_Insert_V2]";
            int id = 0;

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col, userId);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                col.Add(idOut);
            },
            returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oId = returnCollection["@Id"].Value;

                int.TryParse(oId.ToString(), out id);
            });
            return id;
        }

        public void Update(EventUpdateRequest model, int userId)
        {
            string procName = "[dbo].[Events_Update_V2]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col, userId);
                col.AddWithValue("@Id", model.Id);
            },
            returnParameters: null);
        }

        public Paged<Event> GetAllDetails(int pageIndex, int pageSize)
        {
            Paged<Event> pagedList = null;
            List<Event> list = null;
            int totalCount = 0;

            string procName = "[dbo].[Events_SelectAllDetails]";

            _data.ExecuteCmd(procName, (SqlParameterCollection inputParams) =>
            {
                inputParams.AddWithValue("@PageIndex", pageIndex);
                inputParams.AddWithValue("@PageSize", pageSize);
            },
            (IDataReader reader, short set) =>
            {
                int startingIndex = 0;

                Event events = MapEvent(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (list == null)
                {
                    list = new List<Event>();
                }
                list.Add(events);
            });
            if (list != null)
            {
                pagedList = new Paged<Event>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public Paged<Event> Search(int pageIndex, int pageSize, string query)
        {
            Paged<Event> pagedList = null;
            List<Event> list = null;
            int totalCount = 0;

            string procName = "[dbo].[Events_Search]";

            _data.ExecuteCmd(procName, (SqlParameterCollection inputParams) =>
            {
                inputParams.AddWithValue("@PageIndex", pageIndex);
                inputParams.AddWithValue("@PageSize", pageSize);
                inputParams.AddWithValue("@Query", query);
            },
            (IDataReader reader, short set) =>
            {
                int startingIndex = 0;

                Event events = MapEvent(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (list == null)
                {
                    list = new List<Event>();
                }
                list.Add(events);
            });
            if (list != null)
            {
                pagedList = new Paged<Event>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }


        public Event GetById(int id)
        {
            string procName = "[dbo].[Events_SelectDetails_ById]";
            Event anEvent = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            }, delegate (IDataReader reader, short set)
            {
                int startidx = 0;
                anEvent = MapEvent(reader, ref startidx);
            });
            return anEvent;
        }

        public Paged<Event> GetCreatedByPaged(int pageIndex, int pageSize, int userId)
        {
            Paged<Event> pagedList = null;
            List<Event> list = null;
            int totalCount = 0;

            string procName = "[dbo].[Events_SelectDetails_ByCreatedBy]";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@CreatedBy", userId);
                paramCollection.AddWithValue("@PageIndex", pageIndex);
                paramCollection.AddWithValue("@PageSize", pageSize);
            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;

                Event events = MapEvent(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (list == null)
                {
                    list = new List<Event>();
                }
                list.Add(events);
            });
            if (list != null)
            {
                pagedList = new Paged<Event>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }
        public void Delete(int id)
        {

            string procName = "[dbo].[Events_Delete_ById]";

            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection paramCollection)
            {

                paramCollection.AddWithValue("@Id", id);


            });

        }

        private static void AddCommonParams(EventAddRequest model, SqlParameterCollection col, int userId)
        {
            col.AddWithValue("@LocationTypeId", model.VenueBase.Location.LocationTypeId);
            col.AddWithValue("@LineOne", model.VenueBase.Location.LineOne);
            col.AddWithValue("@LineTwo", model.VenueBase.Location.LineTwo);
            col.AddWithValue("@City", model.VenueBase.Location.City);
            col.AddWithValue("@Zip", model.VenueBase.Location.Zip);
            col.AddWithValue("@StateId", model.VenueBase.Location.StateId);
            col.AddWithValue("@Latitude", model.VenueBase.Location.Latitude);
            col.AddWithValue("@Longitude", model.VenueBase.Location.Longitude);
            col.AddWithValue("@CreatedBy", userId);
            col.AddWithValue("@VenueName", model.VenueBase.VenueName);
            col.AddWithValue("@VenueDescription", model.VenueBase.VenueDescription);
            col.AddWithValue("@VenueUrl", model.VenueBase.VenueUrl);
            col.AddWithValue("@EventTypeId", model.EventTypeId);
            col.AddWithValue("@Name", model.EventName);
            col.AddWithValue("@Summary", model.Summary);
            col.AddWithValue("@ShortDescription", model.ShortDescription);
            col.AddWithValue("@EventStatusId", model.EventStatusId);
            col.AddWithValue("@ImageUrl", model.ImageUrl);
            col.AddWithValue("@ExternalSiteUrl", model.ExternalSiteUrl);
            col.AddWithValue("@isFree", model.IsFree);
            col.AddWithValue("@DateStart", model.DateStart);
            col.AddWithValue("@DateEnd", model.DateEnd);


        }

        private Event MapEvent(IDataReader reader, ref int startingIndex)
        {
            Event anEvent = new Event();
            anEvent.EventTypes = new LookUp();
            anEvent.EventStatus= new LookUp();
            anEvent.Venue=new VenueBase();
            anEvent.Venue.Location = new Location();

            anEvent.Id = reader.GetSafeInt32(startingIndex++);
            anEvent.EventTypes.Id = reader.GetSafeInt32(startingIndex++);
            anEvent.EventTypes.Name = reader.GetSafeString(startingIndex++);
            anEvent.EventName = reader.GetSafeString(startingIndex++);
            anEvent.Summary = reader.GetSafeString(startingIndex++);
            anEvent.ShortDescription = reader.GetSafeString(startingIndex++);
            anEvent.Venue.Id = reader.GetSafeInt32(startingIndex++);
            anEvent.Venue.VenueName = reader.GetSafeString(startingIndex++);
            anEvent.Venue.VenueDescription = reader.GetSafeString(startingIndex++);
            anEvent.Venue.VenueUrl = reader.GetSafeString(startingIndex++);
            anEvent.Venue.Location.Id = reader.GetSafeInt32(startingIndex++);
            anEvent.Venue.Location.LocationTypeId = reader.GetSafeInt32(startingIndex++);
            anEvent.Venue.Location.Type = reader.GetSafeString(startingIndex++);
            anEvent.Venue.Location.LineOne = reader.GetSafeString(startingIndex++);
            anEvent.Venue.Location.LineTwo = reader.GetSafeString(startingIndex++);
            anEvent.Venue.Location.City = reader.GetSafeString(startingIndex++);
            anEvent.Venue.Location.StateId = reader.GetSafeInt32(startingIndex++);
            anEvent.Venue.Location.State = reader.GetSafeString(startingIndex++);
            anEvent.Venue.Location.Zip = reader.GetSafeString(startingIndex++);
            anEvent.Venue.Location.Latitude = reader.GetSafeDouble(startingIndex++);
            anEvent.Venue.Location.Longitude = reader.GetSafeDouble(startingIndex++);
            anEvent.Venue.Location.DateCreated = reader.GetSafeDateTime(startingIndex++);
            anEvent.Venue.Location.DateModified = reader.GetSafeDateTime(startingIndex++);
            anEvent.Venue.Location.CreatedBy = reader.GetSafeInt32(startingIndex++);
            anEvent.Venue.Location.ModifiedBy = reader.GetSafeInt32(startingIndex++);
            anEvent.EventStatus.Id = reader.GetSafeInt32(startingIndex++);
            anEvent.EventStatus.Name = reader.GetSafeString(startingIndex++);
            anEvent.ImageUrl = reader.GetSafeString(startingIndex++);
            anEvent.ExternalSiteUrl = reader.GetSafeString(startingIndex++);
            anEvent.IsFree = reader.GetSafeBool(startingIndex++);
            anEvent.DateStart = reader.GetSafeDateTime(startingIndex++);
            anEvent.DateEnd = reader.GetSafeDateTime(startingIndex++);
            anEvent.CreatedBy = reader.GetSafeInt32(startingIndex++);

            return anEvent;

        }





    }
}
