using System;

namespace BasicDesk.App.Models.Common
{
    public class TableFilteringModel
    {
        public int? StatusId { get; set; }

        public int? IdSearch { get; set; }

        public string SubjectSearch { get; set; }

        public string RequesterSearch { get; set; }

        public string AssignedToSearch { get; set; }

        public string StartTimeSearch { get; set; }

        public string EndTimeSearch { get; set; }

        public int PerPage { get; set; } = 50;

        public int Offset { get; set; }

        #region Methods
        public bool HasStatusIdFilter()
        {
            return this.StatusId.HasValue;
        }

        public bool HasIdFilter()
        {
            return this.IdSearch.HasValue;
        }

        public bool HasValidStartTimeFilter()
        {
            return DateTime.TryParse(this.StartTimeSearch, out _);
        }

        public DateTime GetStartTimeAsDateTime()
        {
            DateTime.TryParse(this.StartTimeSearch, out DateTime result);
            return result;
        }

        public bool HasValidEndTimeFilter()
        {
            return DateTime.TryParse(this.EndTimeSearch, out _);
        }
        public DateTime GetEndTimeAsDateTime()
        {
            DateTime.TryParse(this.EndTimeSearch, out DateTime result);
            return result;
        }


        public bool HasSubjectFilter()
        {
            return !string.IsNullOrWhiteSpace(this.SubjectSearch);
        }

        public bool HasRequesterFilter()
        {
            return !string.IsNullOrWhiteSpace(this.RequesterSearch);
        }

        public bool HasAssignedToFilter()
        {
            return !string.IsNullOrWhiteSpace(this.AssignedToSearch);
        }
        #endregion
    }
}
