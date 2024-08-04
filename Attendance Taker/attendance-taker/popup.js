document.getElementById('fileInput').addEventListener('change', handleFile, false);

function handleFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    const headerRow = document.getElementById('headerRow');
    const dataBody = document.getElementById('dataBody');

    // Clear previous data
    headerRow.innerHTML = '';
    dataBody.innerHTML = '';

    // Add headers
    const headers = ['Name', 'Email'];
    headers.forEach(header => {
      const th = document.createElement('th');
      th.textContent = header;
      headerRow.appendChild(th);
    });

    // Define column indices for name and email based on your Excel structure
    const nameColIndex = 1; // Index for 'Name'
    const emailColIndex = 2; // Index for 'Email'

    // Add rows
    for (let row = range.s.r + 1; row <= range.e.r; row++) {
      const tr = document.createElement('tr');
      const nameCell = worksheet[XLSX.utils.encode_cell({ r: row, c: nameColIndex })];
      const emailCell = worksheet[XLSX.utils.encode_cell({ r: row, c: emailColIndex })];

      const nameTd = document.createElement('td');
      const emailTd = document.createElement('td');

      const nameValue = nameCell ? nameCell.v : 'No Name';
      const emailValue = emailCell ? emailCell.v : 'No Email';

      nameTd.textContent = nameValue;
      emailTd.textContent = emailValue;

      tr.appendChild(nameTd);
      tr.appendChild(emailTd);

      dataBody.appendChild(tr);

      // Debugging output
      console.log(`Row ${row}: Name = ${nameValue}, Email = ${emailValue}`);
    }
  };
  reader.readAsArrayBuffer(file);
}
