import { Layout } from "@/components/layout/Layout";
import { FORMATIONMETADATA } from "@/utils/constants";

const CGVPage = () => (
  <Layout>
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col items-center mb-6">
  <img src="/logons.png" alt="Logo" className="h-16 mb-2" />
        <h1 className="text-3xl font-bold text-brown-shade">
          Conditions Générales de Vente (CGV)
        </h1>
      </div>
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">1 – GENERALITES</h2>
          <p>
            Les présentes conditions générales de prestation de services ont
            pour objet de préciser l’organisation des relations contractuelles
            entre le Prestataire, le Bénéficiaire, et le Client, elles
            s’appliquent à toutes les prestations dispensées par Wizi Learn.
            <br />
            Le terme « Client » désigne la personne morale signataire de
            convention de formation (au sens de l’article L.63553-2 du Code du
            Travail), ou la personne physique signataire de contrat de formation
            (au sens de l’article L.6353-3 du Code du Travail) et acceptant les
            présentes conditions générales.
            <br />
            Le terme « Bénéficiaire » désigne la personne physique réalisant la
            prestation.
            <br />
            Toutes autres conditions n’engagent le Prestataire qu’après
            acceptation expresse et écrite de sa part.
            <br />
            Le seul fait d’accepter une offre du Prestataire emporte
            l’acceptation sans réserve des présentes conditions générales.
            <br />
            Les offres du Prestataire sont valables dans la limite du délai
            d’option fixé à deux mois à compter de la date de l’offre, sauf
            stipulations contraires portées sur celle-ci.
            <br />
            Les conditions générales peuvent être modifiées à tout moment et
            sans préavis par le Prestataire, les modifications seront
            applicables à toutes les commandes postérieures à la dite
            modification.
            <br />
            Lorsqu’une personne physique entreprend une formation à titre
            individuel et à ses frais, le contrat est réputé formé lors de sa
            signature, il est soumis aux dispositions des articles L.6353-9 du
            Code du Travail.
            <br />
            Lorsque la formation est financée en tout ou partie par la Caisse
            des dépôts et consignations au titre du compte personnel de
            formation avec abondement ou non, les conditions générales
            d’utilisation (CGU) de la CDC valent conventionnement de sorte que
            l’organisme de formation n’a pas à conclure de convention avec le
            Client.
            <br />
            Dans tous les autres cas, la convention, au sens de l’article
            L.6353-2 du Code de Travail, est formée par la réception, par le
            Prestataire, d’un devis signé mentionnant le bon pour accord par
            retour de mail ou courrier du client et la signature de la
            convention bi ou tripartite à l’exception de ceux bénéficiant de
            contractualisation spécifique.
            <br />
            Les formations proposées par le Prestataire relèvent des
            dispositions figurant à la VI° partie du code du travail relatif à
            la formation professionnelle continue dans le cadre de la formation
            professionnelle tout au long de la vie.
            <br />
            Toute validation de devis et convention impliquent l’acceptation
            sans réserve par l’acheteur et son adhésion pleine et entière aux
            présentes conditions générales de vente qui prévalent sur tout autre
            document de l’acheteur, et notamment sur toutes conditions générales
            d’achat.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">
            2 – DOCUMENTS CONTRACTUELS
          </h2>
          <p>
            Les documents régissant l’accord des parties sont, à l’exclusion de
            tout autre, par ordre de priorité décroissante :<br />
            Le règlement intérieur de formation du Prestataire, pris en
            application des articles L.6352-3 à L.6352-5 et R.6352-3 à R.6352-15
            du Code du Travail relatif aux droits et obligations des stagiaires
            au cours des sessions de formation, et à la discipline et aux
            garanties attachées à la mise en œuvre des formations.
            <br />
            Les offres remises par le Prestataire au Client
            <br />
            Les avenants éventuels aux conventions ou contrats de formation
            professionnelle acceptés par les différentes parties
            <br />
            Les éventuelles conventions ou contrats de formation professionnelle
            acceptés par les différentes parties
            <br />
            La facturation,
            <br />
            Les avenants aux présentes conditions générales
            <br />
            Les présentes conditions générales,
            <br />
            Le cas échéant, la fiche d’inscription dûment complétée
            <br />
            Toutes autres annexes.
            <br />
            En cas de contradiction entre l’un de ces documents, celui de
            priorité supérieur prévaudra pour l’interprétation en cause.
            <br />
            Les dispositions des conditions générales et des documents précités
            expriment l’intégralité de l’accord conclu entre les parties. Ces
            dispositions prévalent donc sur toute proposition, échange de
            lettres, notes ou courriers électronique antérieures à sa signature,
            ainsi que sur toute autre disposition figurant dans des documents
            échangés entre les parties et relatifs à l’objet du contrat.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">
            3 – MODALITÉS D’INSCRIPTION
          </h2>
          <p>
            Dans le cadre d’un financement par le CPF, toute inscription sur MCF
            est soumise aux conditions générales d’utilisation du site.{" "}
            <a
              href="https://www.moncompteformation.gouv.fr/espace-public/conditions-generales-dutilisation"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline">
              Consulter les CGU
            </a>
            <br />
            Dans le cadre d’un financement entreprise : A réception de
            l’inscription du Bénéficiaire, le Prestataire fera parvenir une
            convention de formation et précisant les conditions financières.
            <br />
            Dans le cadre d’un auto-financement : A compter de la date de
            signature du contrat de formation, le Bénéficiaire a un délai de
            sept jours pour se rétracter. Il en informe le Prestataire par
            lettre recommandée avec AR.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">
            4 – PRIX, FACTURATION ET RÈGLEMENTS
          </h2>
          <p>
            Le prix comprend uniquement les frais afférents à la formation :
            salaires du formateur, frais de déplacement du formateur, supports
            pédagogiques, locations, et toute dépense nécessaire à la bonne
            exécution de la prestation. Les frais de repas, déplacement et
            d’hébergement restent à la charge exclusive du Bénéficiaire ou du
            Client.
            <br />
            Pour toutes les prestations qui rentrent dans le champ de la
            formation professionnelle tout au long de la vie, nos prix sont
            indiqués en Euros et net de taxes, conformément à l’article 261 du
            Code Général des Impôts. Wizi Learn est un organisme de formation
            non assujetti à la TVA. Pour toutes les autres prestations (bilan
            d’orientation, conseil…), les prix sont calculés hors taxes et
            majorés du taux de TVA.
            <br />
            Les factures sont payables, sans escompte ni ristourne ou remise
            sauf accord particulier. Les dates de paiement convenues
            contractuellement ne peuvent être remises en cause unilatéralement
            par le Client sous quelque prétexte que ce soit, y compris en cas de
            litige. Les factures sont payables à l’ordre de Wizi Learn à
            réception de facture, soit par chèque, soit par virement bancaire.
            <br />
            Dans le cadre d’un financement par la CDC, tout paiement est soumis
            aux conditions générales d’utilisation du site MCF.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">
            5 – RÈGLEMENT PAR UN OPCO
          </h2>
          <p>
            Si le Client souhaite que le règlement soit émis par l’OPCO dont il
            dépend, il lui appartient : de faire une demande de prise en charge
            avant le début de la formation et de s’assurer de la bonne fin de
            cette demande, de l’indiquer explicitement sur la convention de
            formation ou de prise en charge, de s’assurer de la bonne fin du
            paiement par l’organisme qu’il aura désigné. Si l’OPCO ne prend en
            charge que partiellement le coût de la formation, le reliquat sera
            facturé au Client sauf indications contraires de l’OCPO.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">6 – PÉNALITÉ DE RETARD</h2>
          <p>
            Toute somme non payée à l’échéance donnera lieu au paiement par le
            client de pénalités de retard fixées à deux fois le taux d’intérêt
            légal en vigueur au jour de la fin de la prestation majoré de 7
            points augmentés des frais de relance, frais postaux pour un minimum
            de 200 ${FORMATIONMETADATA.euros}.<br />
            Ces pénalités sont exigibles de plein droit, dès réception de l’avis
            informant le client qu’elles ont été portées à son débit.
            <br />
            Si dans les 15 jours qui suivent la mise en œuvre de la clause «
            pénalité de retard », le Client ne s’est pas acquitté des sommes
            restantes dues, la prestation sera résolue de plein droit et pourra
            ouvrir droit à l’allocation de dommages et intérêts au profit de la
            société Wizi Learn.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">
            7 – CONDITIONS DE RÉSILIATION OU D’ABANDON D’UNE PRESTATION
          </h2>
          <p>
            En cas de renoncement par le Client pour un autre motif que la force
            majeure dûment reconnue, à l’exécution de la présente dans un délai
            de 10 jours avant la date de démarrage de la prestation de
            formation, objet de la présente, le Client s’engage au versement de
            la somme de 40% du devis à titre de dédommagement.
            <br />
            En cas de réalisation partielle, le Client s’engage au versement de
            l’intégralité du montant du devis au titre de dédommagement. Cette
            somme n’est pas imputable sur l’obligation de participation au titre
            de la formation professionnelle continue.
            <br />
            Lorsque la formation est financée en tout ou partie par la Caisse
            des dépôts et consignations au titre du compte personnel de
            formation, les conditions générales d’utilisation (CGU) de la CDC
            s’appliquent.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">
            8 – CONDITIONS D’ANNULATION ET DE REPORT D’UNE SEANCE
          </h2>
          <p>
            Le Bénéficiaire peut annuler une séance dans la mesure où cette
            annulation survient au moins deux jours ouvrés avant le jour et
            l’heure prévus. Toute annulation d’une séance doit être communiquée
            par e-mail ou sms à l’adresse du consultant ou formateur ou à
            contact@wizi-learn.com. La séance peut ensuite être reportée selon
            le planning du consultant/ formateur. Le bénéficiaire doit également
            en informer son employeur si la formation se déroule pendant le
            temps de travail et ensuite proposer une nouvelle date de séance
            validée par ce dernier en accord avec le Prestataire.
            <br />
            Si le report implique une modification de la date de fin de la
            prestation, alors le Client s’engage à signer un avenant à la
            convention.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">9 – FORCE MAJEURE</h2>
          <p>
            La responsabilité de la société Wizi Learn ne pourra pas être mise
            en œuvre si la non-exécution ou le retard dans l’exécution de l’une
            de ses obligations décrites dans les présentes conditions générales
            de vente découle d’un cas de force majeure. A ce titre, la force
            majeure s’entend de tout événement extérieur, imprévisible et
            irrésistible au sens de l’article 1148 du Code civil.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">10 – CONFIDENTIALITÉ</h2>
          <p>
            Les informations à caractère personnel qui sont communiquées par le
            bénéficiaire à Wizi Learn en application et dans l’exécution des
            prestations sont confidentielles.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">11 – RENONCIATION</h2>
          <p>
            Le fait pour Wizi Learn de ne pas se prévaloir à un moment donné de
            l’une quelconque des clauses des présentes, ne peut valoir
            renonciation à se prévaloir ultérieurement de ces mêmes clauses.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">12 – INFORMATIONS</h2>
          <p>
            Le Client s’engage à transmettre toutes informations utiles à la
            mise en œuvre du service demandé au Prestataire.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">
            13 – PROTECTION DES DONNÉES PERSONNELLES
          </h2>
          <p>
            Conformément au Règlement 2016/679 du 27 avril 2016 relatif à la
            protection des personnes physiques à l’égard du traitement des
            données à caractère personnel et à la libre circulation de ces
            données, Wizi Learn met en place un traitement de données
            personnelles qui a pour finalité la vente et l’exécution de services
            définis au présent contrat. Le client est informé des éléments
            suivants : l’identité et les coordonnées du responsable du
            traitement : Wizi Learn, tel qu’indiqué en haut des présentes CGV ;
            – les coordonnées du délégué à la protection des données : Alexandre
            Florek – la base juridique du traitement : l’exécution contractuelle
            – les destinataires ou les catégories de destinataires des données à
            caractère personnel, s’ils existent : le responsable du traitement,
            les sous-traitants intervenants, les prescripteurs, les financeurs,
            et OPCO pour les seuls besoins desdites prestations ainsi que toute
            autorité légalement autorisée à accéder aux données personnelles en
            question – aucun transfert hors UE n’est prévu – la durée de
            conservation des données : le temps de la prescription commerciale –
            la personne concernée dispose du droit de demander au responsable du
            traitement l’accès aux données à caractère personnel, la
            rectification ou l’effacement de celles-ci, ou une limitation du
            traitement relatif à la personne concernée, ou du droit de s’opposer
            au traitement et du droit à la portabilité des données – La personne
            concernée a le droit d’introduire une réclamation auprès d’une
            autorité de contrôle – les informations demandées lors de la
            commande sont nécessaires à l’établissement de la facture
            (obligation légale) et la livraison des prestations commandées, sans
            quoi la commande ne pourra pas être passée. Aucune décision
            automatisée ou profilage n’est mis en œuvre au travers du processus
            de commande.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">
            14 – DIFFÉRENDS ÉVENTUELS
          </h2>
          <p>
            Tout litige relatif à l’interprétation, à l’exécution ou la
            réalisation des présentes conditions générales de vente est soumis
            au droit français. A défaut de résolution amiable, le litige sera
            porté devant le Tribunal de commerce de Poitiers, quel que soit le
            siège ou la résidence du Client, nonobstant pluralité de défendeurs
            ou appel en garantie. Cette clause attributive de compétence ne
            s’appliquera pas au cas de litige avec un Client non professionnel
            pour lequel les règles légales de compétence matérielle et
            géographique s’appliqueront. La présente clause est stipulée dans
            l’intérêt de Wizi Learn qui se réserve le droit d’y renoncer si bon
            lui semble.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Mentions légales</h2>
          <p>
            Wizi Learn est un organisme de formation enregistré sous le n°
            75860174486.
            <br />
            Le terme « Prestataire » désigne Wizi Learn, SARL au capital de
            1000€, dont le siège social est situé au 8, rue Evariste Galois,
            86130 Jaunay-Marigny, immatriculée à l’INSEE sous le numéro Siren
            883 622 151, représentée par toute personne habilitée. Téléphone :
            09 72 51 29 04.
          </p>
        </section>
      </div>
      <footer className="mt-12 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Wizi Learn. Tous droits réservés.
      </footer>
    </div>
  </Layout>
);

export default CGVPage;
