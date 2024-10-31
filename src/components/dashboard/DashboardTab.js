import React from 'react';
import ProblemsSection from './DashboardProblems';
import NotificationsSection from './DashboardNotifications';
import DashboardAPIKeyBox from "./DashboardAPIKeyBox";
import DashboardPremiumBottomBox from "./DashboardPremiumBottomBox";

function DashboardTab({goToConfigAPIPage}) {
    return (
        <div className="p-4">
            <DashboardAPIKeyBox goToConfigAPIPage = {() => goToConfigAPIPage()} />
            <ProblemsSection />
            <NotificationsSection />
            <DashboardPremiumBottomBox />
        </div>
    );
}

export default DashboardTab;
