using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Events
{
    public class EventAddRequest
    {

        [Required]
        [Range(1, Int32.MaxValue)]
        public int EventTypeId { get; set; }

        [Required]
        [StringLength(255, MinimumLength = 2)]
        public string EventName { get; set; }

        [Required]
        [StringLength(255, MinimumLength = 2)]
        public string Summary { get; set; }

        [Required]
        [StringLength(4000, MinimumLength = 2)]
        public string ShortDescription { get; set; }

        [Required]
        public VenueBaseAddRequest VenueBase { get; set; }

        [Required]
        [Range(1, Int32.MaxValue)]
        public int EventStatusId { get; set; }

        [Required]
        [StringLength(400, MinimumLength = 2)]
        public string ImageUrl { get; set; }

        [Required]
        [StringLength(400, MinimumLength = 2)]
        public string ExternalSiteUrl { get; set; }

        [Required]
        public bool IsFree { get; set; }

        [Required]
        public DateTime DateStart { get; set; }
        [Required]
        public DateTime DateEnd { get; set; }

 

    }
}
