"use client";

import Link from 'next/link';

export default function Impressum() {
  return (
    <div className="min-h-screen bg-black text-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 text-center sm:text-left">Impressum</h1>
        
        <div className="space-y-6 sm:space-y-8">
          <section className="bg-white/5 rounded-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-orange-400">Angaben gemäß § 5 TMG</h2>
            <div className="text-sm sm:text-base space-y-1">
              <p className="font-medium">Tyler Tan</p>
              <p>Raoul-Wallenberg-Straße 19</p>
              <p>12679 Berlin</p>
              <p>Deutschland</p>
            </div>
          </section>

          <section className="bg-white/5 rounded-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-orange-400">Kontakt</h2>
            <div className="text-sm sm:text-base space-y-2">
              <p>
                <span className="font-medium">E-Mail:</span>{' '}
                <a 
                  href="mailto:tzm2002@protonmail.com" 
                  className="text-orange-500 hover:text-orange-400 underline break-all"
                >
                  tzm2002@protonmail.com
                </a>
              </p>
              <p>
                <span className="font-medium">LinkedIn:</span>{' '}
                <a 
                  href="https://www.linkedin.com/in/tylertan0/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:text-orange-400 underline break-all"
                >
                  linkedin.com/in/tylertan0
                </a>
              </p>
            </div>
          </section>

          <section className="bg-white/5 rounded-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-orange-400">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <div className="text-sm sm:text-base space-y-1">
              <p className="font-medium">Tyler Tan</p>
              <p>Raoul-Wallenberg-Straße 19</p>
              <p>12679 Berlin</p>
            </div>
          </section>

          <section className="bg-white/5 rounded-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-orange-400">EU-Streitschlichtung</h2>
            <div className="text-sm sm:text-base space-y-3">
              <p>
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
                <a 
                  href="https://ec.europa.eu/consumers/odr/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:text-orange-400 underline break-all"
                >
                  https://ec.europa.eu/consumers/odr/
                </a>
              </p>
              <p>
                Unsere E-Mail-Adresse finden Sie oben im Impressum.
              </p>
            </div>
          </section>

          <section className="bg-white/5 rounded-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-orange-400">Verbraucherstreitbeilegung/Universalschlichtungsstelle</h2>
            <p className="text-sm sm:text-base">
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <section className="bg-white/5 rounded-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-orange-400">Haftungsausschluss</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-200">Haftung für Inhalte</h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den 
                  allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht 
                  verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen 
                  zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-200">Haftung für Links</h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. 
                  Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten 
                  Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-200">Urheberrecht</h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen 
                  Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der 
                  Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white/5 rounded-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-orange-400">Datenschutz</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-200">Allgemeine Hinweise</h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  Die Nutzung unserer Webseite ist ohne Angabe personenbezogener Daten möglich. 
                  Diese Website verarbeitet keine personenbezogenen Daten auf einem Server. Alle Daten werden 
                  ausschließlich lokal in Ihrem Browser gespeichert.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-200">Lokale Datenspeicherung (LocalStorage)</h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  Diese Website nutzt die LocalStorage-Funktion Ihres Browsers, um folgende Daten ausschließlich 
                  auf Ihrem Gerät zu speichern:
                </p>
                <ul className="list-disc list-inside text-gray-300 mt-2 ml-4 space-y-1 text-sm sm:text-base">
                  <li>Ihre eingegebenen Visitenkartendaten (Name, E-Mail, Telefon, Adresse, Firma, etc.)</li>
                  <li>Social-Media-Links</li>
                  <li>Ihre Cookie-Einwilligung</li>
                </ul>
                <p className="text-sm sm:text-base text-gray-300 mt-2 leading-relaxed">
                  Diese Daten verlassen niemals Ihr Gerät, es sei denn, Sie teilen aktiv einen generierten 
                  Link. Die Daten werden nicht an unsere Server übertragen oder gespeichert.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-200">Geteilte Visitenkarten-Links</h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  Wenn Sie einen Visitenkarten-Link erstellen und teilen, werden Ihre Visitenkartendaten 
                  in der URL codiert. Diese Daten werden nur im Browser des Empfängers verarbeitet und 
                  nicht auf unseren Servern gespeichert.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-200">Vercel Analytics</h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  Wir nutzen Vercel Analytics zur Analyse der Webseitennutzung. Vercel Analytics ist 
                  datenschutzfreundlich und erfasst:
                </p>
                <ul className="list-disc list-inside text-gray-300 mt-2 ml-4 space-y-1 text-sm sm:text-base">
                  <li>Seitenaufrufe und Navigationsverhalten (anonym)</li>
                  <li>Geräteinformationen (Browsertyp, Betriebssystem)</li>
                  <li>Geographische Informationen (Land, Stadt - anonymisiert)</li>
                </ul>
                <p className="text-sm sm:text-base text-gray-300 mt-2 leading-relaxed">
                  Die Datenverarbeitung erfolgt auf Grundlage Ihrer Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO. 
                  Sie können Ihre Einwilligung jederzeit widerrufen, indem Sie Ihren Browser-Cache und LocalStorage löschen.
                </p>
                <p className="text-sm sm:text-base text-gray-300 mt-2">
                  Weitere Informationen zu Vercel Analytics:{' '}
                  <a 
                    href="https://vercel.com/docs/analytics/privacy-policy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-orange-500 hover:text-orange-400 underline break-all"
                  >
                    vercel.com/docs/analytics/privacy-policy
                  </a>
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-200">Hosting</h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  Diese Website wird auf Servern von Vercel Inc. gehostet. Der Hoster erhebt in sog. Logfiles 
                  folgende Daten, die Ihr Browser übermittelt:
                </p>
                <ul className="list-disc list-inside text-gray-300 mt-2 ml-4 space-y-1 text-sm sm:text-base">
                  <li>IP-Adresse (anonymisiert)</li>
                  <li>Datum und Uhrzeit der Anfrage</li>
                  <li>Zeitzonendifferenz zur Greenwich Mean Time</li>
                  <li>Inhalt der Anforderung</li>
                  <li>HTTP-Statuscode</li>
                  <li>Übertragene Datenmenge</li>
                  <li>Website, von der die Anforderung kommt</li>
                  <li>Informationen zu Browser und Betriebssystem</li>
                </ul>
                <p className="text-sm sm:text-base text-gray-300 mt-2 leading-relaxed">
                  Die Speicherung dient der Sicherstellung der Sicherheit und Stabilität des Angebots. 
                  Rechtsgrundlage ist Art. 6 Abs. 1 S. 1 lit. f DSGVO.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-200">Ihre Rechte</h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  Sie haben das Recht:
                </p>
                <ul className="list-disc list-inside text-gray-300 mt-2 ml-4 space-y-1 text-sm sm:text-base">
                  <li>Auskunft über Ihre von uns verarbeiteten personenbezogenen Daten zu verlangen (Art. 15 DSGVO)</li>
                  <li>Die Berichtigung unrichtiger Daten zu verlangen (Art. 16 DSGVO)</li>
                  <li>Die Löschung Ihrer Daten zu verlangen (Art. 17 DSGVO)</li>
                  <li>Die Einschränkung der Verarbeitung zu verlangen (Art. 18 DSGVO)</li>
                  <li>Der Verarbeitung zu widersprechen (Art. 21 DSGVO)</li>
                  <li>Ihre Einwilligung jederzeit zu widerrufen (Art. 7 Abs. 3 DSGVO)</li>
                  <li>Beschwerde bei einer Aufsichtsbehörde einzulegen (Art. 77 DSGVO)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-200">Daten löschen</h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  Da alle Ihre Daten ausschließlich lokal in Ihrem Browser gespeichert werden, können Sie diese 
                  jederzeit selbst löschen, indem Sie:
                </p>
                <ul className="list-disc list-inside text-gray-300 mt-2 ml-4 space-y-1 text-sm sm:text-base">
                  <li>Den LocalStorage Ihres Browsers für diese Website löschen</li>
                  <li>Die Browser-Cookies für diese Website löschen</li>
                  <li>Die Browserdaten vollständig löschen</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-8 sm:mt-12 text-center">
          <Link 
            href="/" 
            className="inline-block bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg transition-colors text-sm sm:text-base"
          >
            ← Zurück zur Startseite
          </Link>
        </div>
      </div>
    </div>
  );
}
