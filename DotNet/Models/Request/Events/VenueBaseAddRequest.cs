using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Events
{
    public class VenueBaseAddRequest
    {


        [Required]
        [StringLength(255, MinimumLength = 2)]
        public string VenueName { get; set; }


        [Required]
        [StringLength(4000, MinimumLength = 2)]
        public string VenueDescription { get; set; }


        [Required]
        [StringLength(255, MinimumLength = 2)]
        public string VenueUrl { get; set; }

        [Required]
        public Locations.LocationAddRequest Location { get; set; }
    }
}
