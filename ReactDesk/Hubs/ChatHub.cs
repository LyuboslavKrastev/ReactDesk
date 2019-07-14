using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace ReactDesk.Hubs
{
    public class ChatHub : Hub
    {
        public void SendToAll(string name, string message)
        {
            Clients.All.SendAsync("sendToAll", name, message);
        }
    }
}
