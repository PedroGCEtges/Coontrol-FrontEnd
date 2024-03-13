import React, { useState } from 'react';
import './App.css';

function App() {
  const [queryResults, setQueryResults] = useState({});

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('csv_file', file);
    try {
      formData.append('csv_file', file);
      try {
        const response = await fetch('http://localhost:8000/api/upload', {
          method: 'POST',
          body: formData
        });
      
        const data = await response.json();
      
        if (data.queryResults) {
          setQueryResults(data.queryResults);
        } else {
          console.error('Dados de queryResults não estão presentes na resposta da API.');
        }
      } catch (error) {
        console.error('Erro:', error);
      }
      
    } catch (error) {
      console.error('Erro ao enviar o arquivo:', error);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/download-csv');
      const blob = await response.blob();

      const url = window.URL.createObjectURL(new Blob([blob]));
      
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'data.csv');
      
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao fazer o download do arquivo CSV:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Bem-vindo à Aplicação de Teste da Coontrol</h1>
        <p>Esta aplicação permite importar um arquivo CSV e apresenta o resultado das consultas desejadas. 
          Há também um exemplo pronto, para isso basta clicar no botão "Exemplo". Recomendo baixar a tabela
          ao clicar no botão Exemplo, para ter o modelo adequado para importação, bastando apenas adicionar os
          dados desejados na tabela baixada. </p>
        <input type="file" accept=".csv" onChange={handleFileUpload} />
        <button onClick={handleDownload}>Exemplo</button>
        {Object.entries(queryResults).map(([query, result]) => {
  let message = '';
  switch(query) {
    case 'maisFuncionarios':
      message = `A região com mais funcionários é a região <span style="color: red; font-weight: bold;">${result[0]}</span>, com <strong>${result[1]}</strong> funcionários.`;
      break;
    case 'empresaMaisAntiga':
      message = `A empresa mais antiga é <span style="color: red; font-weight: bold;">${result[0]}</span>, fundada em <strong>${result[1]}</strong>.`;
      break;
    case 'regiaoMaisIndustrial':
      message = `A região com mais empresas do setor industrial é a <span style="color: red; font-weight: bold;">${result[0]}</span> com <strong>${result[1]}</strong> empresas.`;
      break;
    case 'numeroEmpresasPorSetor':
      message = `O setor com mais empresas é o setor <span style="color: red; font-weight: bold;">${result[0]}</span> com <strong>${result[1]}</strong> empresas.`;
      break;
    case 'totalFuncionarios':
      message = `O total de funcionários em todas as empresas cadastradas é de <strong>${result[0]}</strong>.`;
      break;
    default:
      message = `Consulta não reconhecida: ${query}.`;
  }

  return (
    <div key={query} className='result-message'>
       <p dangerouslySetInnerHTML={{ __html: message }}></p>
    </div>
  );
})}


      </header>
    </div>
  );
  
}

export default App;
