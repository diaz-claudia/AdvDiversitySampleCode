using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.Event
{
    public class VenueBase
    {
        public int Id { get; set; }
     

        public string VenueName { get; set; }

        public string VenueDescription { get; set; }

        public string VenueUrl { get; set; }

        public Location.Location Location { get; set; }

    }
}
