using BasicDesk.App.Models.Management.ViewModels;
using BasicDesk.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BasicDesk.Services
{
    public class ReportsService
    {
        private BasicDeskDbContext context;

        public ReportsService(BasicDeskDbContext context)
        {
            this.context = context;
        }

        public IEnumerable<ReportViewModel> GetMyRequestsData(string userId)
        {
            var requests = this.context.Requests.Where(r => r.RequesterId == userId).GroupBy(r => r.Status.Name).Select(g => new ReportViewModel
            {
                DimensionOne = g.Key,
                Quantity = g.Count()
            });

            return requests;

        }
    }
}
