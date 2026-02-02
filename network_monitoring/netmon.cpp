/*==============================
   NETWORK MONITOR TOOL v1.0    
================================

1. Aktive Netzwerkverbindungen anzeigen
2. Ping-Test zu einer IP / Domain
3. IP-Adresse und Hostname anzeigen
4. Log-Datei anzeigen
5. Beenden

> Auswahl: Der User kann dann eine Option eingeben, und das Programm führt die Funktion aus. */

#include <iostream>
#include <string>
#include <cstdlib>
#include <limits>

using namespace std;

// Plattformabhängige Befehle und Definitionen

// für Windows
#ifdef _WIN32
    #define CLEAR_SCREEN "cls"
    #define NETSTAT_CMD "netstat -an"
    #define PING_CMD "ping "
    #define IP_HOSTNAME_CMD "ipconfig"
    #define LOG_FILE "network_log.txt"
#else
// für Unix/Linux
    #define CLEAR_SCREEN "clear"
    #define NETSTAT_CMD "netstat -tuln"
    #define PING_CMD "ping -c 4 "
    #define IP_HOSTNAME_CMD "hostname -I && hostname"
    #define LOG_FILE "network_log.txt"
#endif


// Funktionen für die verschiedenen Optionen    
// Bildschirm löschen
void clearScreen() {
    system(CLEAR_SCREEN);
}

// Aktive Netzwerkverbindungen anzeigen
void displayActiveConnections() {
    cout << "Displaying active network connections...\n\n";
    system(NETSTAT_CMD);
}

// Ping-Test zu einer IP / Domain
void pingTest() {
    string target;
    cout << "Enter IP address or domain to ping: ";
    cin >> target;
    string command = PING_CMD + target;
    cout << "\nPinging " << target << "...\n\n";
    system(command.c_str());
}

// IP-Adresse und Hostname anzeigen
void displayIpHostname() {
    cout << "Displaying IP address and hostname...\n\n";
    system(IP_HOSTNAME_CMD);
}

// Log-Datei anzeigen - öffnet die Log-Datei im Standard-Editor
void viewLogFile() {
    cout << "Opening log file (if available)...\n\n";
    string command;
    #ifdef _WIN32
        command = "notepad " + string(LOG_FILE);
    #else
        command = "cat " + string(LOG_FILE);
    #endif
    int result = system(command.c_str());
    if (result != 0) {
        cout << "Log file not found or could not be opened.\n";
    }
}

// Menü anzeigen und Benutzereingabe verarbeiten
void showMenu() {
    clearScreen();
    cout << "=== Network Monitoring Tool ===\n";
    cout << "1. Display Active Network Connections\n";
    cout << "2. Ping Test to an IP/Domain\n";
    cout << "3. Display IP Address and Hostname\n";
    cout << "4. View Log File\n";
    cout << "5. Exit\n";
    cout << "Enter your choice (1-5): ";
}


//hauptprogramm 
int main() {
    int choice;
    bool running = true;

    while (running) {
        showMenu();
        cin >> choice;

        // Handle invalid input
        if (cin.fail()) {
            cin.clear();
            cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
            cout << "Invalid input. Please enter a number between 1 and 5.\n";
            cin.get();
            continue;
        }

        switch (choice) {
            case 1:
                displayActiveConnections();
                cout << "\nPress Enter to continue...";
                cin.get();
                cin.get();
                break;
            case 2:
                pingTest();
                cout << "\nPress Enter to continue...";
                cin.get();
                cin.get();
                break;
            case 3:
                displayIpHostname();
                cout << "\nPress Enter to continue...";
                cin.get();
                cin.get();
                break;
            case 4:
                viewLogFile();
                cout << "\nPress Enter to continue...";
                cin.get();
                cin.get();
                break;
            case 5:
                running = false;
                cout << "Exiting program. Goodbye!\n";
                break;
            default:
                cout << "Invalid choice. Please select a number between 1 and 5.\n";
                cout << "Press Enter to continue...";
                cin.get();
                cin.get();
                break;
        }
    }

    return 0;
}
 