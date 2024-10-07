
#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>
#include <sys/sem.h>
#include "semun.h"
#include <sys/shm.h>

#define BUFFER_SIZE 10 // Tamanho do buffer

int shm_id; // ID da memória compartilhada
char *buffer; // Buffer compartilhado
int in = 0;  // Índice para o produtor
int out = 0; // Índice para o consumidor


static int set_semvalue1(void);
static void del_semvalue1(void);
static int semaphore_p1(void);
static int semaphore_v1(void);
static int sem_id1;

static int set_semvalue2(void);
static void del_semvalue2(void);
static int semaphore_p2(void);
static int semaphore_v2(void);

static int sem_id2;

static int set_semvalue3(void);
static void del_semvalue3(void);
static int semaphore_p3(void);
static int semaphore_v3(void);

static int sem_id3;

int main(int argc, char *argv[]) {
    // Criação da memória compartilhada
    shm_id = shmget(IPC_PRIVATE, sizeof(char) * BUFFER_SIZE, IPC_CREAT | 0666);
    buffer = (char *) shmat(shm_id, NULL, 0);

    // Inicialização dos semáforos
    sem_id1 = semget((key_t)1234, 1, 0666 | IPC_CREAT);  // Excluir seção crítica
    sem_id2 = semget((key_t)5678, 1, 0666 | IPC_CREAT);  // Itens disponíveis
    sem_id3 = semget((key_t)9012, 1, 0666 | IPC_CREAT);  // Espaços disponíveis

    // Inicializa os valores dos semáforos
    set_semvalue1(); // Exclusão mútua (iniciar com 1)
    set_semvalue2(); // Itens disponíveis (iniciar com 0)
    set_semvalue3(); // Espaços disponíveis (iniciar com BUFFER_SIZE)

    // Criação dos processos de produtor e consumidor
    if (fork() == 0) {
        producer();  // Processo filho executa o produtor
    } else {
        consumer();  // Processo pai executa o consumidor
    }

    // Limpeza após a execução
    del_semvalue1();
    del_semvalue2();
    del_semvalue3();
    shmdt(buffer); // Desanexa a memória compartilhada
    shmctl(shm_id, IPC_RMID, 0); // Remove a memória compartilhada

    return 0;
}

static int set_semvalue1(void)
{
    union semun sem_union;
    sem_union.val = 1; // Exclusão mútua começa em 1
    if (semctl(sem_id1, 0, SETVAL, sem_union) == -1) return(0);
    return(1);
}

static int set_semvalue2(void)
{
    union semun sem_union;
    sem_union.val = 0; // Nenhum item disponível no início
    if (semctl(sem_id2, 0, SETVAL, sem_union) == -1) return(0);
    return(1);
}

static int set_semvalue3(void) {
    union semun sem_union;
    sem_union.val = BUFFER_SIZE;  // Espaços disponíveis começa em BUFFER_SIZE
    return (semctl(sem_id3, 0, SETVAL, sem_union) != -1);
}

static void del_semvalue1(void)
{
    union semun sem_union;
    
    if (semctl(sem_id1, 0, IPC_RMID, sem_union) == -1)
        fprintf(stderr, "Failed to delete semaphore\n");
}

static void del_semvalue2(void)
{
    union semun sem_union;
    
    if (semctl(sem_id2, 0, IPC_RMID, sem_union) == -1)
        fprintf(stderr, "Failed to delete semaphore\n");
}

static void del_semvalue3(void)
{
    union semun sem_union;
    
    if (semctl(sem_id3, 0, IPC_RMID, sem_union) == -1)
        fprintf(stderr, "Failed to delete semaphore\n");
}

static int semaphore_p1(void)
{
    struct sembuf sem_b;
    
    sem_b.sem_num = 0;
    sem_b.sem_op = -1; /* P() */
    sem_b.sem_flg = SEM_UNDO;
    if (semop(sem_id1, &sem_b, 1) == -1) {
        fprintf(stderr, "semaphore_p failed\n");
        return(0);
    }
    return(1);
}

static int semaphore_p2(void)
{
    struct sembuf sem_b;
    
    sem_b.sem_num = 0;
    sem_b.sem_op = -1; /* P() */
    sem_b.sem_flg = SEM_UNDO;
    if (semop(sem_id2, &sem_b, 1) == -1) {
        fprintf(stderr, "semaphore_p failed\n");
        return(0);
    }
    return(1);
}

static int semaphore_p3(void)
{
    struct sembuf sem_b;
    
    sem_b.sem_num = 0;
    sem_b.sem_op = -1; /* P() */
    sem_b.sem_flg = SEM_UNDO;
    if (semop(sem_id3, &sem_b, 1) == -1) {
        fprintf(stderr, "semaphore_p failed\n");
        return(0);
    }
    return(1);
}

static int semaphore_v1(void)
{
    struct sembuf sem_b;
    
    sem_b.sem_num = 0;
    sem_b.sem_op = 1; /* V() */
    sem_b.sem_flg = SEM_UNDO;
    if (semop(sem_id1, &sem_b, 1) == -1) {
        fprintf(stderr, "semaphore_v failed\n");
        return(0);
    }
    return(1);
}

static int semaphore_v2(void)
{
    struct sembuf sem_b;
    
    sem_b.sem_num = 0;
    sem_b.sem_op = 10; /* V() */
    sem_b.sem_flg = SEM_UNDO;
    if (semop(sem_id2, &sem_b, 1) == -1) {
        fprintf(stderr, "semaphore_v failed\n");
        return(0);
    }
    return(1);
}

static int semaphore_v3(void)
{
    struct sembuf sem_b;
    
    sem_b.sem_num = 0;
    sem_b.sem_op = 0; /* V() */
    sem_b.sem_flg = SEM_UNDO;
    if (semop(sem_id3, &sem_b, 1) == -1) {
        fprintf(stderr, "semaphore_v failed\n");
        return(0);
    }
    return(1);
}

void producer() {
    for (int i = 0; i < 10; i++) {
        // Espera por um espaço disponível
        semaphore_p2(); // Decrementa o semáforo de espaços

        // Acessa a seção crítica
        semaphore_p1(); // Decrementa o semáforo de exclusão mútua

        // Produz um item (adiciona ao buffer)
        buffer[in] = 'A' + (rand() % 26);  // Produz uma letra
        printf("Produtor [%d] produziu: %c\n", getpid(), buffer[in]);
        fflush(stdout);
        in = (in + 1) % BUFFER_SIZE;  // Move o índice do produtor

        // Libera a seção crítica
        semaphore_v1(); // Incrementa o semáforo de exclusão mútua

        // Sinaliza que um item foi produzido
        semaphore_v3(); // Incrementa o semáforo de itens disponíveis

        sleep(rand() % 2);  // Espera um tempo aleatório
    }
}

void consumer() {
    for (int i = 0; i < 10; i++) {
        // Espera por um item disponível
        semaphore_p3(); // Decrementa o semáforo de itens

        // Acessa a seção crítica
        semaphore_p1(); // Decrementa o semáforo de exclusão mútua

        // Consome um item (remove do buffer)
        char item = buffer[out];
        printf("Consumidor [%d] consumiu: %c\n", getpid(), item);
        fflush(stdout);
        out = (out + 1) % BUFFER_SIZE;  // Move o índice do consumidor

        // Libera a seção crítica
        semaphore_v1(); // Incrementa o semáforo de exclusão mútua

        // Sinaliza que um espaço está disponível
        semaphore_v2(); // Incrementa o semáforo de espaços disponíveis

        sleep(rand() % 2);  // Espera um tempo aleatório
    }
}
