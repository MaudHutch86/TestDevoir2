# Test Voting

TESTING VOTER FUNCTION:

1. Should get the registering voters status
2. Should add a voter 
3. Emits event VoterRegistered"
4. Should not add voter is already registered

TESTING PROPOSAL FUNCTION:

5. Should not register a proposal when registration is not started
6. Should change the status to startRegistrationProposal
7. Should not allow adding voters if registration completed
8. Should add a proposal

TESTING VOTING FUNCTION:

9. Should start voting session
10. Emits event Voted
11. Should note allow to vote if already voted

TESTION TALLY FUNCTION:

12. Tally function test
