#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <fcntl.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <sys/socket.h>
#include <math.h>

#define MAX 100

int code[32];
char hammingCode[MAX];

// Function to calculate parity bit at a given position
int calculateParity(int position, int totalLength) {
    int count = 0;
    for (int i = position - 1; i < totalLength; i += 2 * position) {
        for (int j = i; j < i + position && j < totalLength; j++) {
            if (code[j] == 1) count++;
        }
    }
    return (count % 2 == 0) ? 0 : 1;
}

// Reverses a string
char *reverseString(const char *input) {
    int len = strlen(input);
    char *rev = (char *)malloc(len + 1);
    for (int i = 0; i < len; i++) {
        rev[i] = input[len - i - 1];
    }
    rev[len] = '\0';
    return rev;
}

// Generates Hamming code from a given dataword
void generateHammingCode(char *dataword) {
    int n = strlen(dataword);
    int parityCount = 0;

    // Reverse data for proper bit positioning
    char *reversedData = reverseString(dataword);
    strcpy(dataword, reversedData);
    free(reversedData);

    // Calculate required parity bits
    while (n > (int)pow(2, parityCount) - (parityCount + 1)) {
        parityCount++;
    }

    int totalBits = parityCount + n;
    int j = 0, k = 0;

    // Insert data and placeholder parity bits
    for (int i = 0; i < totalBits; i++) {
        if (i == (int)pow(2, k) - 1) {
            code[i] = 0;  // Placeholder for parity
            k++;
        } else {
            code[i] = dataword[j++] - '0';
        }
    }

    // Calculate actual parity bits
    for (int i = 0; i < parityCount; i++) {
        int pos = (int)pow(2, i);
        code[pos - 1] = calculateParity(pos, totalBits);
    }

    // Store result in global buffer (reversed for final output)
    for (int i = 0; i < totalBits; i++) {
        hammingCode[i] = (code[totalBits - i - 1] == 0) ? '0' : '1';
    }
    hammingCode[totalBits] = '\0';
    printf("Generated Hamming Code: %s\n", hammingCode);
}

int main() {
    int server_fd, server_len, client_len;
    struct sockaddr_in server_address, client_address;
    char input[MAX];

    server_fd = socket(AF_INET, SOCK_DGRAM, 0);
    if (server_fd < 0) {
        perror("Socket creation failed");
        exit(EXIT_FAILURE);
    }

    server_address.sin_family = AF_INET;
    server_address.sin_addr.s_addr = htonl(INADDR_ANY);
    server_address.sin_port = htons(8888);
    server_len = sizeof(server_address);

    if (bind(server_fd, (struct sockaddr *)&server_address, server_len) < 0) {
        perror("Bind failed");
        exit(EXIT_FAILURE);
    }

    printf("UDP Hamming Server is Running...\n");

    client_len = sizeof(client_address);
    recvfrom(server_fd, input, MAX, 0, (struct sockaddr *)&client_address, &client_len);
    printf("Client Connected. Received: %s\n", input);
    sendto(server_fd, "Hello from Server", 18, 0, (struct sockaddr *)&client_address, client_len);

    while (1) {
        memset(input, 0, MAX);
        recvfrom(server_fd, input, MAX, 0, (struct sockaddr *)&client_address, &client_len);

        printf("Received Dataword: %s\n", input);
        if (strcmp(input, "end") == 0) {
            printf("Connection Closed.\n");
            break;
        }

        generateHammingCode(input);
        sendto(server_fd, hammingCode, strlen(hammingCode) + 1, 0, (struct sockaddr *)&client_address, client_len);
        memset(hammingCode, 0, MAX);
    }

    close(server_fd);
    return 0;
}