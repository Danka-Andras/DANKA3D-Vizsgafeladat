using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace _3DadminpanelGM
{
    public partial class OrderStatusWindow : Window
    {
        private Order aktualis;

        public OrderStatusWindow(Order o)
        {
            InitializeComponent();
            aktualis = o;
            statuszBox.SelectedItem = GetItemByText(o.Statusz);
        }

        private void Mentes_Click(object sender, RoutedEventArgs e)
        {
            if (statuszBox.SelectedItem is ComboBoxItem valasztott)
            {
                aktualis.Statusz = valasztott.Content.ToString();
                DialogResult = true;
            }
        }

        private ComboBoxItem GetItemByText(string text)
        {
            foreach (ComboBoxItem item in statuszBox.Items)
            {
                if (item.Content.ToString().ToLower() == text.ToLower())
                    return item;
            }
            return null;
        }
    }
}
