const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "loja_virtual",
});

connection.connect((error) => {
  if (error) {
    console.error("Erro ao conectar ao banco de dados: ", error);
  } else {
    console.log("Conexão bem-sucedida ao banco de dados.");
  }
});

connection.query("UPDATE usuario SET nome = 'João' WHERE id = 1", (error) => {
  if (error) {
    console.error("Erro ao atualizar o usuário: ", error);
  } else {
    console.log("Usuário atualizado com sucesso!");
  }
});

connect.query("SELECT * FROM usuario", (error, results) => {
  if (error) {
    console.error("Erro ao consultar os usuários: ", error);
  } else {
    console.log("Usuários: ", results);
  }
});

connect.query("DELETE FROM tipo_pagamento WHERE id = 3", (error) => {
  if (error) {
    console.error("Erro ao excluir o tipo de pagamento: ", error);
  } else {
    console.log("Tipo de pagamento excluído com sucesso!");
  }
});

const linhas = [];

for (let i = 0; i < 10000; i++) {
  linhas.push({
    nome: `Vela ${i}`,
    descricao: `Vela de aniversário de ${i} anos`,
  });
}

const sqlInsert =
  "INSERT INTO produto (id_categoria, nome, descricao, quantidade, preco) VALUES (1, ?, ?, 1, '11.99')";

connection.beginTransaction((error) => {
  if (error) {
    console.error("Erro ao iniciar a transação: ", error);
    return;
  }

  const insertPromises = linhas.map((item) => {
    return new Promise((resolve, reject) => {
      connection.query(
        sqlInsert,
        [item.nome, item.descricao],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });
  });

  let tt1 = Date.now();
  Promise.all(insertPromises)
    .then(() => {
      connection.commit((error) => {
        if (error) {
          connection.rollback(() => {
            console.error("Erro ao fazer commit da transação");
          });
        } else {
          console.log("Transação concluída com sucesso!");
          const tt2 = Date.now();
          console.log("Tempo de execução (com transação): ", tt2 - tt1, "ms");
        }
      });
    })
    .catch((error) => {
      connection.rollback(() => {
        console.error("Erro durante as inserções", error);
      });
    });
});

const insertPromises2 = linhas.map((item) => {
  return new Promise((resolve, reject) => {
    connection.query(
      sqlInsert,
      [item.nome, item.descricao],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
});

const t1 = Date.now();
Promise.all(insertPromises2)
  .then(() => {
    const t2 = Date.now();
    console.log("Tempo de execução (sem transação): ", t2 - t1, "ms");
  })
  .catch((error) => {
    console.error("Erro durante as inserções", error);
  });
