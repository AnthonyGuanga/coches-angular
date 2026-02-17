const PDFDocument = require('pdfkit');
const fs = require('fs-extra');
const path = require('path');

const outputDir = path.join(__dirname, 'src/assets/docs');
fs.ensureDirSync(outputDir);

// Contenido de los PDFs con secciones destacadas
const pdfs = [
  {
    filename: 'aviso-legal.pdf',
    title: 'Aviso Legal - Angular Motors',
    sections: [
      {
        heading: 'Información de la empresa',
        content: `Angular Motors S.L.
C. Moreras, 2, CC Centro Oeste,
28220 Majadahonda, Madrid, España`
      },
      {
        heading: 'Términos de uso',
        content: `El acceso y uso de este sitio web implica la aceptación de los presentes términos y condiciones legales. Todos los contenidos incluidos, como textos, imágenes, logotipos y diseños, están protegidos por derechos de propiedad intelectual. Queda prohibida la reproducción, distribución o modificación sin autorización expresa de Angular Motors S.L.`
      }
    ]
  },
  {
    filename: 'politica-privacidad.pdf',
    title: 'Política de Privacidad - Angular Motors',
    sections: [
      {
        heading: 'Compromiso',
        content: `En Angular Motors nos comprometemos a proteger la privacidad de nuestros usuarios.`
      },
      {
        heading: 'Uso de datos',
        content: `Los datos personales recopilados, como nombre, correo electrónico y reservas de vehículos, se usan únicamente para gestionar las operaciones y servicios del sitio web. No compartimos información personal con terceros sin su consentimiento.`
      },
      {
        heading: 'Derechos del usuario',
        content: `Usted tiene derecho a acceder, rectificar o eliminar sus datos personales contactando con nosotros en contacto@angularmotors.com.`
      }
    ]
  },
  {
    filename: 'cookies.pdf',
    title: 'Política de Cookies - Angular Motors',
    sections: [
      {
        heading: 'Uso de cookies',
        content: `Angular Motors utiliza cookies propias y de terceros para mejorar la experiencia del usuario, analizar la navegación y personalizar contenidos.`
      },
      {
        heading: 'Aceptación',
        content: `Al utilizar nuestro sitio web, usted acepta el uso de cookies según esta política.`
      },
      {
        heading: 'Configuración',
        content: `Puede configurar o desactivar las cookies en su navegador en cualquier momento.`
      }
    ]
  }
];

// Función para crear PDF estilizado
function createPDF({ filename, title, sections }) {
  const doc = new PDFDocument({ margin: 50 });
  const filePath = path.join(outputDir, filename);
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // Cabecera
  doc.rect(0, 0, doc.page.width, 60).fill('#2563eb'); // azul corporativo
  doc.fillColor('white').fontSize(20).text(title, 50, 20, { align: 'left' });
  doc.moveDown(2);
  doc.fillColor('black');

  sections.forEach((section, index) => {
    doc.moveDown();
    doc.fontSize(16).fillColor('#2563eb').text(section.heading, { underline: true });
    doc.moveDown(0.5);
    doc.fillColor('black').fontSize(12).text(section.content, { align: 'justify', lineGap: 4 });

    // Saltos de página si hay más de 2 secciones por PDF
    if ((index + 1) % 2 === 0 && index !== sections.length - 1) {
      doc.addPage();
    }
  });

  doc.end();

  stream.on('finish', () => {
    console.log(`✅ PDF estilizado generado: ${filePath}`);
  });
}

// Generar todos los PDFs
pdfs.forEach(createPDF);
