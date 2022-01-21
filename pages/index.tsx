import Layout from "../components/Layout";
import Section from "../components/Section";
import { items } from "../utils/constants";

export default function Home() {

    return (
        <Layout>
            <Section name="Widgets" items={items} />
        </Layout>
    )
}
