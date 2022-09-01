using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Sabio.Models.Domain.Event
{
    public class Event
    {
     public int Id { get; set; }
   
    public LookUp EventTypes { get; set; }

    public string EventName { get; set; }
       
    public string Summary { get; set; }

    public string ShortDescription { get; set; }

    public VenueBase Venue { get; set; }

    public LookUp EventStatus { get; set; }
    
    public string ImageUrl { get; set; }

    public string ExternalSiteUrl { get; set; }

    public bool IsFree { get; set; }

    public DateTime DateStart { get; set; }
    public DateTime DateEnd { get; set; }

    public int CreatedBy { get; set; }

    }
}
