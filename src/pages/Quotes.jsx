import { Text, Divider } from '@mantine/core';

import { useData } from '../context/DataProvider';

import QuotesTable from '../components/tables/QuotesTable';

import '../styles/quotes/quotes.css'

export default function Quotes() {
    const { quoteData, clientData, projectData } = useData();

    return (
        <div className="quotes-page-container">
            <section className="main-title-section">
                <h1 className="main-title">Historique des devis</h1>
                <Text className="main-subtitle" c="dimmed">
                    Liste de tous les devis validés
                </Text>
            </section>
            <Divider className="divider" />
            <section className="quotes-list-table-section">
                <section className="quotes-datagrid">
                    <QuotesTable
                        quoteData={quoteData}
                        clientData={clientData}
                        projectData={projectData}
                    />
                </section>
            </section>
        </div>
    );
};
