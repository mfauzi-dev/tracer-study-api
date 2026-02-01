export const jawabanKuesionerTemplate = (rows, tahun_akademik) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Data Jawaban Kuesioner</title>
        <style>
            .cetak {
                font-family: sans-serif;
                color: #232323;
                border-collapse: collapse;
                width: 100%;
            }
            .cetak, th, td {
                border: 1px solid #999;
                padding: 8px 20px;
            }
            .cetak th {
                background-color: #04AA6D;
                color: white;
            }
            .cetak tr:nth-child(even) {
                background-color: #f2f2f2;
            }
        </style>
    </head>
    <body>
        <center>
            <h3>Data Jawaban Kuesioner</h3>
            <h4>Tahun Akademik: ${tahun_akademik}</h4>
        </center>
        <table class="cetak">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Nama Alumni</th>
                    <th>Pertanyaan</th>
                    <th>Jawaban</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>
    </body>
    </html>
  `;
};
