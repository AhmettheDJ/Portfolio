/*==============================
   NETWORK MONITOR TOOL v1.0
==============================

1. Aktive Netzwerkverbindungen anzeigen
2. Ping-Test zu einer IP / Domain
3. IP-Adresse und Hostname anzeigen
4. Log-Datei anzeigen
5. Beenden

> Auswahl: Der User kann dann eine Option eingeben, und das Programm führt die Funktion aus. */


#include <iostream>
#include <string>
#include <vector>
#include <fstream>
#include <winsock2.h>
#include <iphlpapi.h>
#include <winerror.h>
#include <stdio.h>
#include <cstring>
#include <limits>

#pragma comment(lib, "winsock2.lib")
#pragma comment(lib, "iphlpapi.lib")
#pragma comment(lib, "ws2_32.lib")

#define RED "\033[31m"
#define GREEN "\033[32m"
#define YELLOW "\033[33m"
#define BLUE "\033[34m"
#define RESET "\033[0m"


using namespace std;






// Klasse mit allen Funktionen als Methoden
class NetworkMonitoring
{
private:
    const string LOG_FILE = "network_log.txt";

    // Private Hilfsfunktionen
    void logEvent(const string& message) {
        ofstream logFile(LOG_FILE, ios::app);
        if (logFile.is_open()) {
            logFile << message << endl;
            logFile.close();
        }
    }

public:
    // Konstruktor und Destruktor
    NetworkMonitoring();
    ~NetworkMonitoring();

    // Öffentliche Methoden
    void showMenu() const {
        cout << BLUE << "\n=== Network Monitor Tool Menu ===" << RESET << endl;
        cout << "1. Show Active Network Connections" << endl;
        cout << "2. Ping Test to an IP/Domain" << endl;
        cout << "3. Show IP Address and Hostname" << endl;
        cout << "4. Show Log File" << endl;
        cout << "5. Exit" << endl;
        cout << BLUE << "=================================" << RESET << endl;
    }

    void showNetworkConnections() {
        cout << GREEN << "Active Network Connections:" << RESET << endl;
        
        // Windows API: Netzwerk-Adapter auslesen
        PIP_ADAPTER_INFO pAdapterInfo = (IP_ADAPTER_INFO *) malloc(sizeof(IP_ADAPTER_INFO));
        DWORD dwBufLen = sizeof(IP_ADAPTER_INFO);

        // Buffer vergrößern falls nötig
        if (GetAdaptersInfo(pAdapterInfo, &dwBufLen) == ERROR_BUFFER_OVERFLOW) {
            free(pAdapterInfo);
            pAdapterInfo = (IP_ADAPTER_INFO *) malloc(dwBufLen);
        } 

        if (GetAdaptersInfo(pAdapterInfo, &dwBufLen) == NO_ERROR) {
            PIP_ADAPTER_INFO pAdapter = pAdapterInfo;
            int count = 1;
            
            while (pAdapter) {
                cout << YELLOW << "Adapter " << count << ":" << RESET << endl;
                cout << "  Name: " << pAdapter->AdapterName << endl;
                cout << "  Description: " << pAdapter->Description << endl;
                cout << "  IP Address: " << pAdapter->IpAddressList.IpAddress.String << endl;
                cout << "  Subnet Mask: " << pAdapter->IpAddressList.IpMask.String << endl;
                cout << endl;
                
                pAdapter = pAdapter->Next;
                count++;
            }
            logEvent("Displayed active network connections.");
        } else {
            cout << RED << "Error: Could not get adapter info." << RESET << endl;
            logEvent("Error: Could not get adapter info.");
        }

        if (pAdapterInfo)
            free(pAdapterInfo);
    }

    void pingTest() {
        cout << "Enter IP or Domain to ping: ";
        string target;
        cin >> target;
        cin.ignore(); // Buffer cleaning
        
        // Windows ping command verwenden (einfachste Lösung)
        string command = "ping -n 4 " + target;  // -n für Windows statt -c
        cout << "Pinging " << target << "..." << endl;
        system(command.c_str());
        
        logEvent("Performed ping test to " + target);
    }

    void showIP() {
        cout << GREEN << "IP Address and Hostname Information:" << RESET << endl;
        
        // Hostname auslesen
        char hostname[256];
        if (gethostname(hostname, sizeof(hostname)) != SOCKET_ERROR) {
            cout << "Hostname: " << hostname << endl;
        } else {
            cout << RED << "Error getting hostname." << RESET << endl;
        }

        // IP-Adresse auslesen
        struct hostent* host = gethostbyname(hostname);
        if (host != NULL && host->h_addr_list[0] != NULL) {
            struct in_addr* addr = (struct in_addr*) host->h_addr_list[0];
            cout << "IP Address: " << inet_ntoa(*addr) << endl;
        } else {
            cout << RED << "Error getting IP address." << RESET << endl;
        }
        
        logEvent("Displayed IP address and hostname.");
    }

    void showLogs() {
        cout << YELLOW << "\n=== Network Log ===" << RESET << endl;
        system("type network_log.txt");
        cout << YELLOW << "===================" << RESET << endl;
    }

    void startMonitoring() {
        cout << BLUE << "Starting Network Monitoring..." << RESET << endl;
        logEvent("Network monitoring started.");
    }

    void stopMonitoring() {
        cout << YELLOW << "Stopping Network Monitoring..." << RESET << endl;
        logEvent("Network monitoring stopped.");
    }

    void run() {
        int choice;
        startMonitoring();

        do {
            showMenu();
            cout << "Enter your choice: ";
            
            if (!(cin >> choice)) {
                // Fehlerzustand des Streams löschen
                cin.clear(); 
                // Ungültige Eingabe aus dem Puffer entfernen
                cin.ignore(numeric_limits<streamsize>::max(), '\n');
                choice = 0; 
            }
            cin.ignore(); // Newline aus dem Buffer löschen

            switch (choice) {
                case 1:
                    showNetworkConnections();
                    break;
                case 2:
                    pingTest();
                    break;
                case 3:
                    showIP();
                    break;
                case 4:
                    showLogs();
                    break;
                case 5:
                    cout << RED << "Exiting Network Monitor Tool." << RESET << endl;
                    stopMonitoring();
                    break;
                default:
                    cout << RED << "Invalid choice. Please try again." << RESET << endl;
                    logEvent("Invalid choice entered.");
            }
        } while (choice != 5);
    }
};

// Implementierung der Konstruktoren
NetworkMonitoring::NetworkMonitoring() {
    cout << GREEN << "Network Monitoring Tool initialized." << RESET << endl;
}

NetworkMonitoring::~NetworkMonitoring() {
    cout << GREEN << "Network Monitoring Tool destroyed." << RESET << endl;
}

// Main Funktion - Benutzt die Klasse
int main() {
    NetworkMonitoring monitor;
    monitor.run();
    return 0;
}
