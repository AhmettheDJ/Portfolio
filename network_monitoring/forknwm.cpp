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
#include <ws2tcpip.h>
#include <ctime>

// For MinGW compilation
#ifndef _WIN32_WINNT
#define _WIN32_WINNT 0x0600
#endif

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
            // Zeitstempel hinzufügen
            time_t now = time(0);
            char* dt = ctime(&now);
            dt[strlen(dt)-1] = '\0'; // Newline entfernen
            logFile << "[" << dt << "] " << message << endl;
            logFile.close();
        }
    }

    void initializeWinsock() {
        WSADATA wsaData;
        if (WSAStartup(MAKEWORD(2, 2), &wsaData) != 0) {
            cerr << RED << "WSAStartup failed!" << RESET << endl;
        }
    }

    void cleanupWinsock() {
        WSACleanup();
    }

    // Alternative implementation for getaddrinfo functions
    string getIPAddressFallback() {
        char hostname[256];
        if (gethostname(hostname, sizeof(hostname)) != SOCKET_ERROR) {
            struct hostent* host = gethostbyname(hostname);
            if (host != NULL && host->h_addr_list[0] != NULL) {
                struct in_addr addr;
                memcpy(&addr, host->h_addr_list[0], sizeof(struct in_addr));
                return string(inet_ntoa(addr));
            }
        }
        return "Unable to determine IP address";
    }

public:
    // Konstruktor und Destruktor
    NetworkMonitoring() {
        initializeWinsock();
        cout << GREEN << "Network Monitoring Tool initialized." << RESET << endl;
    }
    
    ~NetworkMonitoring() {
        cleanupWinsock();
        cout << GREEN << "Network Monitoring Tool destroyed." << RESET << endl;
    }

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
        
        DWORD dwSize = 0;
        DWORD dwRetVal = 0;
        
        // Zuerst die benötigte Puffergröße ermitteln
        if (GetAdaptersInfo(NULL, &dwSize) != ERROR_BUFFER_OVERFLOW) {
            cout << RED << "Error getting adapter info size." << RESET << endl;
            logEvent("Error getting adapter info size.");
            return;
        }

        PIP_ADAPTER_INFO pAdapterInfo = (PIP_ADAPTER_INFO)malloc(dwSize);
        if (pAdapterInfo == NULL) {
            cout << RED << "Memory allocation failed for adapter info." << RESET << endl;
            logEvent("Memory allocation failed for adapter info.");
            return;
        }

        dwRetVal = GetAdaptersInfo(pAdapterInfo, &dwSize);
        if (dwRetVal == NO_ERROR) {
            PIP_ADAPTER_INFO pAdapter = pAdapterInfo;
            int count = 1;
            
            while (pAdapter) {
                cout << YELLOW << "Adapter " << count << ":" << RESET << endl;
                cout << "  Name: " << pAdapter->AdapterName << endl;
                cout << "  Description: " << pAdapter->Description << endl;
                cout << "  IP Address: " << pAdapter->IpAddressList.IpAddress.String << endl;
                cout << "  Subnet Mask: " << pAdapter->IpAddressList.IpMask.String << endl;
                if (pAdapter->GatewayList.IpAddress.String[0] != '\0') {
                    cout << "  Gateway: " << pAdapter->GatewayList.IpAddress.String << endl;
                }
                cout << "  MAC Address: ";
                for (DWORD i = 0; i < pAdapter->AddressLength; i++) {
                    if (i == (pAdapter->AddressLength - 1))
                        printf("%.2X\n", (int)pAdapter->Address[i]);
                    else
                        printf("%.2X-", (int)pAdapter->Address[i]);
                }
                cout << endl;
                
                pAdapter = pAdapter->Next;
                count++;
            }
            logEvent("Displayed active network connections.");
        } else {
            cout << RED << "Error: Could not get adapter info (Error code: " << dwRetVal << ")." << RESET << endl;
            logEvent("Error: Could not get adapter info.");
        }

        free(pAdapterInfo);
    }

    void pingTest() {
        cout << "Enter IP or Domain to ping: ";
        string target;
        getline(cin, target);
        
        if (target.empty()) {
            cout << RED << "Error: No target specified." << RESET << endl;
            return;
        }
        
        // Windows ping command verwenden
        string command = "ping -n 4 " + target;
        cout << "Pinging " << target << "..." << endl;
        int result = system(command.c_str());
        
        if (result == 0) {
            cout << GREEN << "Ping successful!" << RESET << endl;
            logEvent("Ping test to " + target + " - SUCCESS");
        } else {
            cout << RED << "Ping failed!" << RESET << endl;
            logEvent("Ping test to " + target + " - FAILED");
        }
    }

    void showIP() {
        cout << GREEN << "IP Address and Hostname Information:" << RESET << endl;
        
        // Hostname auslesen
        char hostname[256];
        if (gethostname(hostname, sizeof(hostname)) != SOCKET_ERROR) {
            cout << "Hostname: " << hostname << endl;
        } else {
            cout << RED << "Error getting hostname." << RESET << endl;
            logEvent("Error getting hostname.");
            return;
        }

        // Use fallback method for MinGW compatibility
        cout << "IP Address: " << getIPAddressFallback() << endl;
        
        logEvent("Displayed IP address and hostname.");
    }

    void showLogs() {
        cout << YELLOW << "\n=== Network Log ===" << RESET << endl;
        
        ifstream logFile(LOG_FILE);
        if (logFile.is_open()) {
            string line;
            while (getline(logFile, line)) {
                cout << line << endl;
            }
            logFile.close();
        } else {
            cout << RED << "Log file not found or cannot be opened." << RESET << endl;
        }
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
            cout << "Enter your choice (1-5): ";
            
            if (!(cin >> choice)) {
                // Fehlerzustand des Streams löschen
                cin.clear(); 
                // Ungültige Eingabe aus dem Puffer entfernen
                cin.ignore(numeric_limits<streamsize>::max(), '\n');
                cout << RED << "Invalid input. Please enter a number between 1-5." << RESET << endl;
                continue;
            }
            cin.ignore(numeric_limits<streamsize>::max(), '\n'); // Buffer clearing

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
                    cout << RED << "Invalid choice. Please enter a number between 1-5." << RESET << endl;
                    logEvent("Invalid choice entered.");
            }
            
            if (choice != 5) {
                cout << "\nPress Enter to continue...";
                cin.get();
            }
            
        } while (choice != 5);
    }
};

// Main Funktion
int main() {
    NetworkMonitoring monitor;
    monitor.run();
    return 0;
}