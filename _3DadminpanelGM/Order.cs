using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace _3DadminpanelGM
{
    public class Order
    {
        public int Id { get; set; }
        public string? Email { get; set; }
        public string? Termek { get; set; }
        public int Mennyiseg { get; set; }
        public decimal Ar { get; set; }
        public string? Statusz { get; set; }
    }
}
