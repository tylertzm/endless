"use client";

import Link from 'next/link';

export default function Impressum() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Impressum</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">Angaben gemäß § 5 TMG</h2>
            <p>Tyler Tan</p>
            <p>Raoul-Wallenberg-Straße 19</p>
            <p>12679 Berlin</p>
            <p>Deutschland</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Kontakt</h2>
            <p>E-Mail: tzm2002@protonmail.com</p>
            <p>
              LinkedIn:{' '}
              <a 
                href="https://www.linkedin.com/in/tylertan0/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-orange-500 hover:text-orange-400 underline"
              >
                linkedin.com/in/tylertan0
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <p>Tyler Tan</p>
            <p>Raoul-Wallenberg-Straße 19</p>
            <p>12679 Berlin</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">EU-Streitschlichtung</h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
              <a 
                href="https://ec.europa.eu/consumers/odr/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-orange-500 hover:text-orange-400 underline"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
            </p>
            <p className="mt-2">
              Unsere E-Mail-Adresse finden Sie oben im Impressum.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Verbraucherstreitbeilegung/Universalschlichtungsstelle</h2>
            <p>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Haftungsausschluss</h2>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Haftung für Inhalte</h3>
            <p className="text-gray-300">
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den 
              allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht 
              verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen 
              zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            </p>

            <h3 className="text-xl font-semibold mt-4 mb-2">Haftung für Links</h3>
            <p className="text-gray-300">
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. 
              Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten 
              Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>

            <h3 className="text-xl font-semibold mt-4 mb-2">Urheberrecht</h3>
            <p className="text-gray-300">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen 
              Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der 
              Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Datenschutz</h2>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Allgemeine Hinweise</h3>
            <p className="text-gray-300">
              Die Nutzung unserer Webseite ist ohne Angabe personenbezogener Daten möglich. 
              Diese Website verarbeitet keine personenbezogenen Daten auf einem Server. Alle Daten werden 
              ausschließlich lokal in Ihrem Browser gespeichert.
            </p>

            <h3 className="text-xl font-semibold mt-4 mb-2">Lokale Datenspeicherung (LocalStorage)</h3>
            <p className="text-gray-300">
              Diese Website nutzt die LocalStorage-Funktion Ihres Browsers, um folgende Daten ausschließlich 
              auf Ihrem Gerät zu speichern:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2 ml-4">
              <li>Ihre eingegebenen Visitenkartendaten (Name, E-Mail, Telefon, Adresse, Firma, etc.)</li>
              <li>Hochgeladene Bilder (Foto, Logo) in Base64-Format</li>
              <li>Social-Media-Links</li>
              <li>Ihre Cookie-Einwilligung</li>
            </ul>
            <p className="text-gray-300 mt-2">
              Diese Daten verlassen niemals Ihr Gerät, es sei denn, Sie teilen aktiv einen generierten 
              Link. Die Daten werden nicht an unsere Server übertragen oder gespeichert.
            </p>

            <h3 className="text-xl font-semibold mt-4 mb-2">Geteilte Visitenkarten-Links</h3>
            <p className="text-gray-300">
              Wenn Sie einen Visitenkarten-Link erstellen und teilen, werden Ihre Visitenkartendaten 
              in der URL codiert. Diese Daten werden nur im Browser des Empfängers verarbeitet und 
              nicht auf unseren Servern gespeichert.
            </p>

            <h3 className="text-xl font-semibold mt-4 mb-2">Vercel Analytics</h3>
            <p className="text-gray-300">
              Wir nutzen Vercel Analytics zur Analyse der Webseitennutzung. Vercel Analytics ist 
              datenschutzfreundlich und erfasst:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2 ml-4">
              <li>Seitenaufrufe und Navigationsverhalten (anonym)</li>
              <li>Geräteinformationen (Browsertyp, Betriebssystem)</li>
              <li>Geographische Informationen (Land, Stadt - anonymisiert)</li>
            </ul>
            <p className="text-gray-300 mt-2">
              Die Datenverarbeitung erfolgt auf Grundlage Ihrer Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO. 
              Sie können Ihre Einwilligung jederzeit widerrufen, indem Sie Ihren Browser-Cache und LocalStorage löschen.
            </p>
            <p className="text-gray-300 mt-2">
              Weitere Informationen zu Vercel Analytics:{' '}
              <a 
                href="https://vercel.com/docs/analytics/privacy-policy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-orange-500 hover:text-orange-400 underline"
              >
                vercel.com/docs/analytics/privacy-policy
              </a>
            </p>

            <h3 className="text-xl font-semibold mt-4 mb-2">Hosting</h3>
            <p className="text-gray-300">
              Diese Website wird auf Servern von Vercel Inc. gehostet. Der Hoster erhebt in sog. Logfiles 
              folgende Daten, die Ihr Browser übermittelt:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2 ml-4">
              <li>IP-Adresse (anonymisiert)</li>
              <li>Datum und Uhrzeit der Anfrage</li>
              <li>Zeitzonendifferenz zur Greenwich Mean Time</li>
              <li>Inhalt der Anforderung</li>
              <li>HTTP-Statuscode</li>
              <li>Übertragene Datenmenge</li>
              <li>Website, von der die Anforderung kommt</li>
              <li>Informationen zu Browser und Betriebssystem</li>
            </ul>
            <p className="text-gray-300 mt-2">
              Die Speicherung dient der Sicherstellung der Sicherheit und Stabilität des Angebots. 
              Rechtsgrundlage ist Art. 6 Abs. 1 S. 1 lit. f DSGVO.
            </p>

            <h3 className="text-xl font-semibold mt-4 mb-2">Ihre Rechte</h3>
            <p className="text-gray-300">
              Sie haben das Recht:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2 ml-4">
              <li>Auskunft über Ihre von uns verarbeiteten personenbezogenen Daten zu verlangen (Art. 15 DSGVO)</li>
              <li>Die Berichtigung unrichtiger Daten zu verlangen (Art. 16 DSGVO)</li>
              <li>Die Löschung Ihrer Daten zu verlangen (Art. 17 DSGVO)</li>
              <li>Die Einschränkung der Verarbeitung zu verlangen (Art. 18 DSGVO)</li>
              <li>Der Verarbeitung zu widersprechen (Art. 21 DSGVO)</li>
              <li>Ihre Einwilligung jederzeit zu widerrufen (Art. 7 Abs. 3 DSGVO)</li>
              <li>Beschwerde bei einer Aufsichtsbehörde einzulegen (Art. 77 DSGVO)</li>
            </ul>

            <h3 className="text-xl font-semibold mt-4 mb-2">Daten löschen</h3>
            <p className="text-gray-300">
              Da alle Ihre Daten ausschließlich lokal in Ihrem Browser gespeichert werden, können Sie diese 
              jederzeit selbst löschen, indem Sie:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2 ml-4">
              <li>Den LocalStorage Ihres Browsers für diese Website löschen</li>
              <li>Die Browser-Cookies für diese Website löschen</li>
              <li>Die Browserdaten vollständig löschen</li>
            </ul>
          </section>
        </div>

        <div className="mt-12">
          <Link 
            href="/" 
            className="inline-block bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg transition-colors"
          >
            ← Zurück zur Startseite
          </Link>
        </div>
      </div>
    </div>
  );
}
