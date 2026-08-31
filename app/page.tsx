import Calculators from "@/components/Calculators";

export default function Page() {
  return (
    <>
      <header className="hero">
        <div className="wrap">
          <span className="eyebrow">Aquarium d&apos;eau douce</span>
          <h1>Dimensionnez votre bac avant d&apos;acheter</h1>
          <p>
            La moitié des échecs en aquariophilie se joue avant la mise en eau : un bac sous-filtré,
            un chauffage sous-dimensionné, une population calculée sur le volume affiché plutôt que sur
            le volume réel. Ces quatre calculateurs répondent à ces questions en une minute.
          </p>
        </div>
      </header>

      <main className="wrap">
        <Calculators />
      </main>

      <footer>
        <div className="wrap">
          <p>
            <strong>En tant que Partenaire Amazon, je réalise un bénéfice sur les achats remplissant
            les conditions requises.</strong>
          </p>
          <p>
            Aucun prix n&apos;est affiché sur ce site. Les liens renvoient vers les résultats de recherche
            Amazon.fr, où le prix et la disponibilité en vigueur font foi.
          </p>
          <p>
            Les calculs proposés sont des ordres de grandeur destinés à orienter un choix de matériel.
            Ils ne remplacent pas l&apos;observation du bac ni le suivi régulier des paramètres de l&apos;eau.
          </p>
        </div>
      </footer>
    </>
  );
}
