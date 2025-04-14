using System.Collections.ObjectModel;
using System.Net.Http.Headers;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace _3DadminpanelGM
{
    public partial class MainWindow : Window
    {
        private readonly HttpClient _httpClient = new();

        private ObservableCollection<Order> rendelesek = new ObservableCollection<Order>();

        public MainWindow()
        {
            InitializeComponent();
            FeltoltTesztAdatokkal();
            ordersGrid.ItemsSource = rendelesek;
        }

        private async Task LoadOrdersAsync()
        {
            try
            {
                _httpClient.BaseAddress = new Uri("https://localhost:7182/");
                _httpClient.DefaultRequestHeaders.Accept.Clear();
                _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                var response = await _httpClient.GetAsync("api/orders");
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                var orders = JsonSerializer.Deserialize<List<Order>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

               ordersGrid.ItemsSource = orders;
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Hiba a rendelések betöltésekor: {ex.Message}");
            }
        }

        private void FeltoltTesztAdatokkal()
        {
            rendelesek.Add(new Order { Id = 1, Email = "teszt@pelda.hu", Termek = "Kulcstartó", Mennyiseg = 2, Ar = 2990, Statusz = "készül" });
            rendelesek.Add(new Order { Id = 2, Email = "valaki@gmail.com", Termek = "Telefontartó", Mennyiseg = 1, Ar = 3990, Statusz = "készül" });
            rendelesek.Add(new Order { Id = 3, Email = "anna@danka3d.hu", Termek = "Logós toll", Mennyiseg = 5, Ar = 1990, Statusz = "készül" });
            rendelesek.Add(new Order { Id = 4, Email = "gabor@pelda.com", Termek = "3D nyomtatott figura", Mennyiseg = 1, Ar = 5990, Statusz = "készül" });
            rendelesek.Add(new Order { Id = 5, Email = "rita@example.com", Termek = "Telefontartó", Mennyiseg = 3, Ar = 3990, Statusz = "készül" });
            rendelesek.Add(new Order { Id = 6, Email = "norbert@valami.hu", Termek = "Egyedi kulcstartó", Mennyiseg = 2, Ar = 3490, Statusz = "készül" });
            rendelesek.Add(new Order { Id = 7, Email = "lili@teszt.hu", Termek = "Kis ajándéktárgy", Mennyiseg = 4, Ar = 1590, Statusz = "készül" });
            rendelesek.Add(new Order { Id = 8, Email = "zsolt@user.net", Termek = "Névre szóló tábla", Mennyiseg = 1, Ar = 6990, Statusz = "készül" });
            rendelesek.Add(new Order { Id = 9, Email = "bence@danka3d.hu", Termek = "3D nyomtatott logó", Mennyiseg = 1, Ar = 8990, Statusz = "készül" });
            rendelesek.Add(new Order { Id = 10, Email = "katalin@tesztmail.hu", Termek = "Telefontartó", Mennyiseg = 2, Ar = 3990, Statusz = "készül" });
            rendelesek.Add(new Order { Id = 11, Email = "tamas@webshop.com", Termek = "Mini szobor", Mennyiseg = 1, Ar = 7490, Statusz = "készül" });
            rendelesek.Add(new Order { Id = 12, Email = "zsuzsa@valami.hu", Termek = "Egyedi gravírozás", Mennyiseg = 3, Ar = 2990, Statusz = "készül" });
            rendelesek.Add(new Order { Id = 13, Email = "ferenc@proba.net", Termek = "DANKA3D matrica", Mennyiseg = 10, Ar = 990, Statusz = "készül" });
            rendelesek.Add(new Order { Id = 14, Email = "istvan@danka3d.hu", Termek = "Telefontartó", Mennyiseg = 1, Ar = 3990, Statusz = "készül" });
            rendelesek.Add(new Order { Id = 15, Email = "nora@shop.hu", Termek = "Kulcstartó", Mennyiseg = 2, Ar = 2990, Statusz = "készül" });
            rendelesek.Add(new Order { Id = 16, Email = "gyula@example.com", Termek = "3D nyomtatott névtábla", Mennyiseg = 1, Ar = 6490, Statusz = "készül" });
        }


        private void ModifyOrder_Click(object sender, RoutedEventArgs e)
        {
            if ((sender as Button)?.DataContext is Order kivOrder)
            {
                var ablak = new OrderStatusWindow(kivOrder);
                if (ablak.ShowDialog() == true)
                {
                    ordersGrid.Items.Refresh();
                }
            }
        }

        private void DeleteOrder_Click(object sender, RoutedEventArgs e)
        {
            if ((sender as Button)?.DataContext is Order torlendo)
            {
                if (MessageBox.Show("Biztosan törlöd ezt a rendelést?", "Megerősítés", MessageBoxButton.YesNo) == MessageBoxResult.Yes)
                {
                    rendelesek.Remove(torlendo);
                }
            }
        }
    }
}