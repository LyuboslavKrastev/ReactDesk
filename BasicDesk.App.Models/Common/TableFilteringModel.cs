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
    }
}
